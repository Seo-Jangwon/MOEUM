package com.weseethemusic.recommendation.common.service.elasticsearch;

import com.weseethemusic.recommendation.common.entity.History;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.dto.recommendation.UserPreference;
import com.weseethemusic.recommendation.repository.HistoryRepository;
import java.util.ArrayList;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PreferenceAnalyzer {

    private final HistoryRepository historyRepository;
    private static final int TOP_ITEMS_LIMIT = 5;

    @Transactional(readOnly = true)
    public UserPreference analyzePreference(long memberId) {
        List<History> histories = historyRepository.findByMemberId(memberId);

        if (histories.isEmpty()) {
            return createDefaultPreference();
        }

        List<Music> musicList = new ArrayList<>();
        for (History history : histories) {
            musicList.add(history.getMusic());
        }

        return UserPreference.builder()
            .averageFeatures(calculateAverageFeatures(musicList))
            .topArtistIds(findTopArtistIds(musicList))
            .topGenreIds(findTopGenreIds(musicList))
            .build();
    }

    private UserPreference.MusicFeatures calculateAverageFeatures(List<Music> musicList) {
        return UserPreference.MusicFeatures.builder()
            .danceability(calculateAverage(musicList, Music::getDanceability))
            .loudness(calculateAverage(musicList, Music::getLoudness))
            .speechiness(calculateAverage(musicList, Music::getSpeechiness))
            .acousticness(calculateAverage(musicList, Music::getAcousticness))
            .valence(calculateAverage(musicList, Music::getValence))
            .tempo(calculateAverage(musicList, Music::getTempo))
            .energy(calculateAverage(musicList, Music::getEnergy))
            .build();
    }

    private double calculateAverage(List<Music> musicList,
        java.util.function.ToDoubleFunction<Music> mapper) {
        if (musicList.isEmpty()) {
            return 0.0;
        }
        double sum = 0.0;
        for (Music music : musicList) {
            sum += mapper.applyAsDouble(music);
        }
        return sum / musicList.size();
    }

    private List<Long> findTopArtistIds(List<Music> musicList) {
        List<Long> allArtistIds = new ArrayList<>();
        for (Music music : musicList) {
            for (var artistMusic : music.getArtistMusics()) {
                allArtistIds.add(artistMusic.getArtist().getId());
            }
        }

        return allArtistIds.stream()
            .collect(Collectors.groupingBy(
                artistId -> artistId,
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
            .limit(TOP_ITEMS_LIMIT)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    private List<Integer> findTopGenreIds(List<Music> musicList) {
        List<Integer> allGenreIds = new ArrayList<>();
        for (Music music : musicList) {
            allGenreIds.add(music.getGenre().getId());
        }

        return allGenreIds.stream()
            .collect(Collectors.groupingBy(
                genreId -> genreId,
                Collectors.counting()
            ))
            .entrySet().stream()
            .sorted(Map.Entry.<Integer, Long>comparingByValue().reversed())
            .limit(TOP_ITEMS_LIMIT)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
    }

    private UserPreference createDefaultPreference() {
        return UserPreference.builder()
            .averageFeatures(UserPreference.MusicFeatures.builder()
                .danceability(0.5)
                .loudness(-7.0)
                .speechiness(0.1)
                .acousticness(0.5)
                .valence(0.5)
                .tempo(120.0)
                .energy(0.5)
                .build())
            .topArtistIds(List.of())
            .topGenreIds(List.of())
            .build();
    }
}