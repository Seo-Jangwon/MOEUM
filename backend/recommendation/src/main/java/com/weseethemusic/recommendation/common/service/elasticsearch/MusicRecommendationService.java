package com.weseethemusic.recommendation.common.service.elasticsearch;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.MatchQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import com.weseethemusic.recommendation.common.document.MusicDocument;
import com.weseethemusic.recommendation.dto.history.ArtistDto;
import com.weseethemusic.recommendation.dto.recommendation.MusicDto;
import com.weseethemusic.recommendation.dto.recommendation.UserPreference;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class MusicRecommendationService {

    private static final String INDEX_NAME = "music";
    private final PreferenceAnalyzer preferenceAnalyzer;
    private final ElasticsearchClient elasticsearchClient;

    public MusicRecommendationService(PreferenceAnalyzer preferenceAnalyzer,
        ElasticsearchClient elasticsearchClient) {
        this.preferenceAnalyzer = preferenceAnalyzer;
        this.elasticsearchClient = elasticsearchClient;
    }

    public List<MusicDto> getRecommendations(long memberId) throws IOException {
        UserPreference preference = preferenceAnalyzer.analyzePreference(memberId);
        BoolQuery.Builder boolQuery = new BoolQuery.Builder();

        // 장르 필터 적용
        addGenreFilter(boolQuery, preference.getTopGenreIds());

        // 아티스트 필터 적용
        addArtistFilter(boolQuery, preference.getTopArtistIds());

        // 음악 특성 필터 적용
        addMusicFeatureFilters(boolQuery, preference.getAverageFeatures());

        // 검색 요청 생성 및 실행
        SearchRequest searchRequest = createSearchRequest(boolQuery);
        SearchResponse<MusicDocument> searchResponse = elasticsearchClient.search(searchRequest,
            MusicDocument.class);

        // 결과 변환
        return convertSearchResults(searchResponse);
    }

    private void addGenreFilter(BoolQuery.Builder boolQuery, List<Integer> genreIds) {
        if (!genreIds.isEmpty()) {
            BoolQuery.Builder genreBool = new BoolQuery.Builder();
            for (Integer genreId : genreIds) {
                MatchQuery matchQuery = new MatchQuery.Builder()
                    .field("genre.id")
                    .query(String.valueOf(genreId))
                    .build();
                Query query = new Query.Builder().match(matchQuery).build();
                genreBool.should(query);
            }
            boolQuery.filter(new Query.Builder().bool(genreBool.build()).build());
        }
    }

    private void addArtistFilter(BoolQuery.Builder boolQuery, List<Long> artistIds) {
        if (!artistIds.isEmpty()) {
            BoolQuery.Builder artistBool = new BoolQuery.Builder();
            for (Long artistId : artistIds) {
                MatchQuery matchQuery = new MatchQuery.Builder()
                    .field("artists.id")
                    .query(String.valueOf(artistId))
                    .build();
                Query query = new Query.Builder().match(matchQuery).build();
                artistBool.should(query);
            }
            boolQuery.filter(new Query.Builder().bool(artistBool.build()).build());
        }
    }

    private void addMusicFeatureFilters(BoolQuery.Builder boolQuery,
        UserPreference.MusicFeatures features) {
        // Danceability 범위
        addRangeFilter(boolQuery, "danceability", features.getDanceability(), 0.1);

        // Loudness 범위
        addRangeFilter(boolQuery, "loudness", features.getLoudness(), 3.0);

        // Speechiness 범위
        addRangeFilter(boolQuery, "speechiness", features.getSpeechiness(), 0.1);

        // Acousticness 범위
        addRangeFilter(boolQuery, "acousticness", features.getAcousticness(), 0.1);

        // Valence 범위
        addRangeFilter(boolQuery, "valence", features.getValence(), 0.1);

        // Tempo 범위
        addRangeFilter(boolQuery, "tempo", features.getTempo(), 20.0);

        // Energy 범위
        addRangeFilter(boolQuery, "energy", features.getEnergy(), 0.1);
    }

    private void addRangeFilter(BoolQuery.Builder boolQuery, String field, double value,
        double range) {
        Query rangeQuery = new Query.Builder()
            .range(r -> r
                .field(field)
                .gte(JsonData.of(value - range))
                .lte(JsonData.of(value + range)))
            .build();
        boolQuery.filter(rangeQuery);
    }

    private SearchRequest createSearchRequest(BoolQuery.Builder boolQuery) {
        return SearchRequest.of(builder ->
            builder
                .index(INDEX_NAME)
                .query(q -> q.bool(boolQuery.build()))
                .size(5)
        );
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
        music.setName(document.getName());
        music.setDuration(formatDuration(document.getDuration()));

        if (document.getAlbum() != null) {
            System.out.println("앨범 정보: " + document.getAlbum());
            System.out.println("앨범 이미지: " + document.getAlbum().getImageName());
            music.setImageName(document.getAlbum().getImageName());
        } else {
            System.out.println("앨범 없음");
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