package com.weseethemusic.recommendation.common.service.elasticsearch;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.BulkRequest;
import co.elastic.clients.elasticsearch.core.BulkResponse;
import co.elastic.clients.elasticsearch.indices.CreateIndexRequest;
import com.weseethemusic.recommendation.common.document.MusicDocument;
import com.weseethemusic.recommendation.common.entity.Music;
import java.io.StringReader;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MusicIndexService {

    private static final String INDEX_NAME = "music";
    private final ElasticsearchClient elasticsearchClient;

    public void deleteIndex() throws IOException {
        try {
            elasticsearchClient.indices().delete(d -> d.index(INDEX_NAME));
        } catch (Exception e) {
            log.error("인덱스 삭제 불가: {}", e.getMessage());
        }
    }

    public void createIndex() throws IOException {
        String mapping = StreamUtils.copyToString(
            new ClassPathResource("elasticsearch/music-mapping.json").getInputStream(),
            StandardCharsets.UTF_8
        );

        CreateIndexRequest request = CreateIndexRequest.of(builder ->
            builder.index(INDEX_NAME)
                .withJson(new StringReader(mapping))
        );

        elasticsearchClient.indices().create(request);
    }


    public void indexMusic(List<Music> musicList) throws IOException {
        List<MusicDocument> documents = new ArrayList<>();
        for (Music music : musicList) {
            documents.add(convertToDocument(music));
        }

        BulkRequest.Builder requestBuilder = new BulkRequest.Builder();

        for (MusicDocument document : documents) {
            requestBuilder.operations(operationBuilder ->
                operationBuilder.index(indexBuilder ->
                    indexBuilder
                        .index(INDEX_NAME)
                        .id(String.valueOf(document.getId()))
                        .document(document)
                )
            );
        }

        BulkResponse result = elasticsearchClient.bulk(requestBuilder.build());

        if (result.errors()) {
            throw new RuntimeException("벌크 인덱싱 실패");
        }
    }

    private MusicDocument convertToDocument(Music music) {

        MusicDocument document = MusicDocument.builder()
            .id(music.getId())
            .name(music.getName())
            .album(music.getAlbum() != null ? MusicDocument.AlbumInfo.builder()
                .id(music.getAlbum().getId())
                .name(music.getAlbum().getName())
                .imageName(music.getAlbum().getImageName())
                .releaseDate(music.getAlbum().getReleaseDate().toString())
                .build() : null)
            .genre(MusicDocument.GenreInfo.builder()
                .id(music.getGenre().getId())
                .name(music.getGenre().getName())
                .build())
            .artists(music.getArtistMusics().stream()
                .map(am -> MusicDocument.ArtistInfo.builder()
                    .id(am.getArtist().getId())
                    .name(am.getArtist().getName())
                    .build())
                .collect(Collectors.toList()))
            .duration(music.getDuration())
            .danceability(music.getDanceability())
            .loudness(music.getLoudness())
            .mode(music.isMode())
            .speechiness(music.getSpeechiness())
            .acousticness(music.getAcousticness())
            .valence(music.getValence())
            .tempo(music.getTempo())
            .energy(music.getEnergy())
            .build();

        return document;
    }
}