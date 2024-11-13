package com.weseethemusic.recommendation.dto.recommendation;

import java.util.List;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserPreference {

    private MusicFeatures averageFeatures;
    private List<Long> topArtistIds;
    private List<Integer> topGenreIds;

    @Getter
    @Builder
    public static class MusicFeatures {

        private double danceability;
        private double loudness;
        private double speechiness;
        private double acousticness;
        private double valence;
        private double tempo;
        private double energy;
    }
}