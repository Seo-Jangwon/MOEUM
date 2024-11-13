package com.weseethemusic.recommendation.controller;

import com.weseethemusic.recommendation.dto.history.ArtistDto;
import com.weseethemusic.recommendation.dto.recommendation.MusicDto;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;

@SpringBootTest
class RecommendationControllerTest {

    @Autowired
    private RecommendationController recommendationController;

    @Test
    void 사용자별_음악_추천() {
        // 사용자 1
        System.out.println("===== 사용자 1의 추천 음악 =====");
        ResponseEntity<Map<String, Object>> response1 = recommendationController.recommendations(
            1L);
        printRecommendations(response1);

        // 사용자 2
        System.out.println("\n===== 사용자 2의 추천 음악 =====");
        ResponseEntity<Map<String, Object>> response2 = recommendationController.recommendations(
            2L);
        printRecommendations(response2);

        // 사용자 3
        System.out.println("\n===== 사용자 3의 추천 음악 =====");
        ResponseEntity<Map<String, Object>> response3 = recommendationController.recommendations(
            3L);
        printRecommendations(response3);

        // 사용자 4
        System.out.println("\n===== 사용자 4의 추천 음악 =====");
        ResponseEntity<Map<String, Object>> response4 = recommendationController.recommendations(
            4L);
        printRecommendations(response4);
    }

    private void printRecommendations(ResponseEntity<Map<String, Object>> response) {
        if (response.getBody() != null) {
            Map<String, Object> data = (Map<String, Object>) response.getBody().get("data");
            if (data != null) {
                List<MusicDto> recommendedMusics = (List<MusicDto>) data.get("recommendedMusics");
                if (recommendedMusics != null) {
                    recommendedMusics.forEach(music -> {
                        System.out.println("음악 ID: " + music.getId());
                        System.out.println("제목: " + music.getName());
                        System.out.println("재생시간: " + music.getDuration());
                        System.out.println("앨범 이미지: " + music.getImageName());
                        System.out.println("아티스트: " + music.getArtists().stream()
                            .map(ArtistDto::getName)
                            .collect(Collectors.joining(", ")));
                        System.out.println("--------------------");
                    });
                }
            }
        }
    }
}
