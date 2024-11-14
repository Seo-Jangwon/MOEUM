package com.weseethemusic.recommendation.common.service.elasticsearch;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.Script;
import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.FunctionScore;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import com.weseethemusic.recommendation.common.document.MusicDocument;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.dto.history.ArtistDto;
import com.weseethemusic.recommendation.dto.recommendation.MusicDto;
import com.weseethemusic.recommendation.dto.recommendation.UserPreference;
import com.weseethemusic.recommendation.repository.MusicRepository;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class MusicRecommendationService {

    private static final String INDEX_NAME = "music";
    private final PreferenceAnalyzer preferenceAnalyzer;
    private final ElasticsearchClient elasticsearchClient;
    private final MusicRepository musicRepository;

    public MusicRecommendationService(PreferenceAnalyzer preferenceAnalyzer,
        ElasticsearchClient elasticsearchClient, MusicRepository musicRepository) {
        this.preferenceAnalyzer = preferenceAnalyzer;
        this.elasticsearchClient = elasticsearchClient;
        this.musicRepository = musicRepository;
    }

    @Transactional(readOnly = true)
    public List<MusicDto> getRecommendations(Long musicId, Long memberId) throws IOException {
        UserPreference preference = preferenceAnalyzer.analyzePreference(memberId);
        Music currentMusic = null;

        if (musicId != null) {
            currentMusic = musicRepository.findById(musicId)
                .orElseThrow(() -> new IllegalArgumentException("음악을 찾을 수 없습니다."));
            log.info("현재 재생중인 음악: {}", currentMusic.getName());
            preference = preferenceAnalyzer.combinePreferences(preference, currentMusic, 0.3,
                0.7); // 현재 음악의 가중치를 더 높임
        }

        Query query = createRecommendationQuery(musicId, preference, currentMusic);
        log.debug("생성된 쿼리: {}", query);

        SearchResponse<MusicDocument> searchResponse = elasticsearchClient.search(s -> s
            .index(INDEX_NAME)
            .query(query)
            .size(5)
            .trackScores(true)
            .sort(sort -> sort.score(sc -> sc.order(SortOrder.Desc))), MusicDocument.class);

        log.info("검색 완료 - total hits: {}", searchResponse.hits().total().value());

        if (searchResponse.hits().hits().isEmpty()) {
            log.warn("추천 결과 없음");
        } else {
            for (Hit<MusicDocument> hit : searchResponse.hits().hits()) {
                log.debug("Hit - score: {}, music: {}", hit.score(), hit.source().getName());
            }
        }

        return convertSearchResults(searchResponse);
    }

    private Query createRecommendationQuery(Long currentMusicId, UserPreference preference,
        Music currentMusic) {
        BoolQuery.Builder boolQuery = new BoolQuery.Builder();

        // 현재 음악 제외
        if (currentMusicId != null) {
            boolQuery.mustNot(q -> q.match(m -> m.field("id").query(currentMusicId.toString())));
        }

        List<Query> shouldQueries = new ArrayList<>();

        // 장르 매칭 (현재 음악의 장르에 높은 가중치)
        if (currentMusic != null) {
            shouldQueries.add(Query.of(q -> q
                .match(m -> m
                    .field("genre.id")
                    .query(String.valueOf(currentMusic.getGenre().getId()))
                    .boost(3.0f))));
        }

        // 선호 장르 매칭
        for (Integer genreId : preference.getTopGenreIds()) {
            shouldQueries.add(Query.of(q -> q
                .match(m -> m
                    .field("genre.id")
                    .query(genreId.toString())
                    .boost(1.5f))));
        }

        // 현재 음악의 아티스트 매칭
        if (currentMusic != null) {
            for (var artistMusic : currentMusic.getArtistMusics()) {
                shouldQueries.add(Query.of(q -> q
                    .match(m -> m
                        .field("artists.id")
                        .query(String.valueOf(artistMusic.getArtist().getId()))
                        .boost(2.0f))));
            }
        }

        // 선호 아티스트 매칭
        for (Long artistId : preference.getTopArtistIds()) {
            shouldQueries.add(Query.of(q -> q
                .match(m -> m
                    .field("artists.id")
                    .query(artistId.toString())
                    .boost(1.0f))));
        }

        // 현재 음악이 있다면 더 높은 가중치
        float featureBoost = currentMusic != null ? 2.0f : 1.0f;
        addFeatureQueries(shouldQueries, preference.getAverageFeatures(), featureBoost);

        boolQuery.should(shouldQueries);
        boolQuery.minimumShouldMatch("1");

        return Query.of(q -> q.bool(boolQuery.build()));
    }

    private void addFeatureQueries(List<Query> queries, UserPreference.MusicFeatures features,
        float boost) {
        addFeatureQuery(queries, "danceability", features.getDanceability(), 0.1, boost);
        addFeatureQuery(queries, "energy", features.getEnergy(), 0.1, boost);
        addFeatureQuery(queries, "valence", features.getValence(), 0.1, boost);
        addFeatureQuery(queries, "tempo", features.getTempo(), 20.0, boost);
        addFeatureQuery(queries, "acousticness", features.getAcousticness(), 0.1, boost);
        addFeatureQuery(queries, "speechiness", features.getSpeechiness(), 0.1, boost);
        addFeatureQuery(queries, "loudness", features.getLoudness(), 3.0, boost);
    }

    private void addFeatureQuery(List<Query> queries, String field, double value, double range,
        float boost) {
        queries.add(Query.of(q -> q
            .range(r -> r
                .field(field)
                .gte(JsonData.of(value - range))
                .lte(JsonData.of(value + range))
                .boost(boost))));
    }

    private List<MusicDto> convertSearchResults(SearchResponse<MusicDocument> searchResponse) {
        List<MusicDto> results = new ArrayList<>();
        List<Hit<MusicDocument>> hits = searchResponse.hits().hits();

        for (Hit<MusicDocument> hit : hits) {
            MusicDocument document = hit.source();
            if (document != null) {
                results.add(convertToDto(document));
            }
        }

        return results;
    }

    private MusicDto convertToDto(MusicDocument document) {
        MusicDto music = new MusicDto();
        music.setId(document.getId());
        music.setTitle(document.getName());
        music.setDuration(formatDuration(document.getDuration()));
        music.setGenre(document.getGenre().getName());

        if (document.getAlbum() != null) {
            log.info("앨범 정보: {}", document.getAlbum());
            music.setAlbumImage(document.getAlbum().getImageName());
        } else {
            log.error("앨범 없음");
        }

        List<ArtistDto> artistDtos = new ArrayList<>();
        for (MusicDocument.ArtistInfo artist : document.getArtists()) {
            ArtistDto artistDto = ArtistDto.builder()
                .id(artist.getId())
                .name(artist.getName())
                .build();
            artistDtos.add(artistDto);
        }
        music.setArtists(artistDtos);

        return music;
    }

    private String formatDuration(int seconds) {
        int minutes = seconds / 60;
        int remainingSeconds = seconds % 60;
        return String.format("%02d분%02d초", minutes, remainingSeconds);
    }
}