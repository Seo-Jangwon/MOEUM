package com.weseethemusic.recommendation.common.document;


import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MusicDocument {

    private long id;
    private String name;

    private AlbumInfo album;
    private GenreInfo genre;
    private List<ArtistInfo> artists;

    private int duration;
    private double danceability;
    private double loudness;
    private boolean mode;
    private double speechiness;
    private double acousticness;
    private double valence;
    private double tempo;
    private double energy;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AlbumInfo {

        private long id;
        private String name;
        private String imageName;
        private String releaseDate;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenreInfo {

        private int id;
        private String name;
    }

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ArtistInfo {

        private long id;
        private String name;
    }
}
