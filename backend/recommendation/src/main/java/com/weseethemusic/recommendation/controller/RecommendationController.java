package com.weseethemusic.recommendation.controller;

import com.weseethemusic.recommendation.common.service.elasticsearch.MusicRecommendationService;
import com.weseethemusic.recommendation.dto.recommendation.MusicDto;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final MusicRecommendationService musicRecommendationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> recommendations(
        @RequestParam(required = false) Long musicId,
        @RequestHeader("X-Member-Id") Long memberId) {

        Map<String, Object> response = new HashMap<>();
        try {
            log.info("memberId: {}, musicId: {}", memberId, musicId);
            List<MusicDto> recommendedMusics = musicRecommendationService.getRecommendations(
                musicId, memberId);
            Map<String, Object> data = new HashMap<>();
            data.put("recommendedMusics", recommendedMusics);

            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }

    }

}
