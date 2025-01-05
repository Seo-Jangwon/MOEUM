package com.weseethemusic.recommendation.common.service.elasticsearch;

import com.weseethemusic.recommendation.common.entity.History;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.dto.recommendation.UserPreference;
import com.weseethemusic.recommendation.repository.HistoryRepository;
import java.util.ArrayList;
import java.util.HashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PreferenceAnalyzer {

    private final HistoryRepository historyRepository;
    private static final int TOP_ITEMS_LIMIT = 5;

    @Transactional(readOnly = true)
    public UserPreference analyzePreference(long memberId) {
        log.info("회원: {}에 대한 선호도 분석중", memberId);

        List<History> histories = historyRepository.findByMemberId(memberId);
        log.debug("{} 개의 재생목록 확인", histories.size());

        if (histories.isEmpty()) {
            log.info("재생목록 찾을 수 없음. 기본 추천 반환");
            return createDefaultPreference();
        }

        List<Music> musicList = new ArrayList<>();
        for (History history : histories) {
            musicList.add(history.getMusic());
        }

        UserPreference preference = UserPreference.builder()
            .averageFeatures(calcAverageFeatures(musicList))
            .topArtistIds(findTopArtistIds(musicList))
            .topGenreIds(findTopGenreIds(musicList))
            .build();

        log.debug("선호도 분석 결과: {}", preference);
        return preference;
    }

    private UserPreference.MusicFeatures calcAverageFeatures(List<Music> musicList) {
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

        Map<Long, Long> frequencyMap = new HashMap<>();
        for (Long artistId : allArtistIds) {
            frequencyMap.put(artistId, frequencyMap.getOrDefault(artistId, 0L) + 1);
        }

        List<Map.Entry<Long, Long>> entries = new ArrayList<>(frequencyMap.entrySet());
        entries.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));

        List<Long> topArtists = new ArrayList<>();
        for (int i = 0; i < Math.min(TOP_ITEMS_LIMIT, entries.size()); i++) {
            topArtists.add(entries.get(i).getKey());
        }

        return topArtists;
    }

    private List<Integer> findTopGenreIds(List<Music> musicList) {
        List<Integer> allGenreIds = new ArrayList<>();
        for (Music music : musicList) {
            allGenreIds.add(music.getGenre().getId());
        }

        Map<Integer, Long> frequencyMap = new HashMap<>();
        for (Integer genreId : allGenreIds) {
            frequencyMap.put(genreId, frequencyMap.getOrDefault(genreId, 0L) + 1);
        }

        List<Map.Entry<Integer, Long>> entries = new ArrayList<>(frequencyMap.entrySet());
        entries.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));

        List<Integer> topGenres = new ArrayList<>();
        for (int i = 0; i < Math.min(TOP_ITEMS_LIMIT, entries.size()); i++) {
            topGenres.add(entries.get(i).getKey());
        }

        return topGenres;
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

    // 현재 음악 고려
    public UserPreference combinePreferences(UserPreference preference, Music currentMusic,
        double historyWeight, double currentWeight) {
        UserPreference.MusicFeatures currentFeatures = UserPreference.MusicFeatures.builder()
            .danceability(currentMusic.getDanceability())
            .loudness(currentMusic.getLoudness())
            .speechiness(currentMusic.getSpeechiness())
            .acousticness(currentMusic.getAcousticness())
            .valence(currentMusic.getValence())
            .tempo(currentMusic.getTempo())
            .energy(currentMusic.getEnergy())
            .build();

        UserPreference.MusicFeatures combinedFeatures = combineFeatures(
            preference.getAverageFeatures(),
            currentFeatures,
            historyWeight,
            currentWeight
        );

        // 현재 음악의 장르와 아티스트를 상위 목록에 추가
        List<Integer> combinedGenreIds = new ArrayList<>();
        combinedGenreIds.add(currentMusic.getGenre().getId()); // 현재 음악의 장르를 첫 번째로

        for (Integer genreId : preference.getTopGenreIds()) {
            if (!genreId.equals(currentMusic.getGenre().getId())) {
                combinedGenreIds.add(genreId);
            }
        }

        if (combinedGenreIds.size() > 5) {
            combinedGenreIds = combinedGenreIds.subList(0, 5);
        }

        List<Long> combinedArtistIds = new ArrayList<>();
        for (var artistMusic : currentMusic.getArtistMusics()) {
            combinedArtistIds.add(artistMusic.getArtist().getId());
        }

        for (Long artistId : preference.getTopArtistIds()) {
            if (!combinedArtistIds.contains(artistId)) {
                combinedArtistIds.add(artistId);
            }
        }

        if (combinedArtistIds.size() > 5) {
            combinedArtistIds = combinedArtistIds.subList(0, 5);
        }

        return UserPreference.builder()
            .averageFeatures(combinedFeatures)
            .topGenreIds(combinedGenreIds)
            .topArtistIds(combinedArtistIds)
            .build();
    }

    private UserPreference.MusicFeatures combineFeatures(
        UserPreference.MusicFeatures userFeatures,
        UserPreference.MusicFeatures currentFeatures,
        double userWeight,
        double currentWeight
    ) {
        return UserPreference.MusicFeatures.builder()
            .danceability(
                weightedAverage(userFeatures.getDanceability(), currentFeatures.getDanceability(),
                    userWeight, currentWeight))
            .loudness(weightedAverage(userFeatures.getLoudness(), currentFeatures.getLoudness(),
                userWeight, currentWeight))
            .speechiness(
                weightedAverage(userFeatures.getSpeechiness(), currentFeatures.getSpeechiness(),
                    userWeight, currentWeight))
            .acousticness(
                weightedAverage(userFeatures.getAcousticness(), currentFeatures.getAcousticness(),
                    userWeight, currentWeight))
            .valence(
                weightedAverage(userFeatures.getValence(), currentFeatures.getValence(), userWeight,
                    currentWeight))
            .tempo(weightedAverage(userFeatures.getTempo(), currentFeatures.getTempo(), userWeight,
                currentWeight))
            .energy(
                weightedAverage(userFeatures.getEnergy(), currentFeatures.getEnergy(), userWeight,
                    currentWeight))
            .build();
    }

    private double weightedAverage(double value1, double value2, double weight1, double weight2) {
        return (value1 * weight1) + (value2 * weight2);
    }
}