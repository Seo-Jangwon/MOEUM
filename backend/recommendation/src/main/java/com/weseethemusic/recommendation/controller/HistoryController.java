package com.weseethemusic.recommendation.controller;

import com.weseethemusic.recommendation.common.exception.CustomException;
import com.weseethemusic.recommendation.common.exception.ErrorCode;
import com.weseethemusic.recommendation.dto.ResponseDto;
import com.weseethemusic.recommendation.dto.history.MusicDto;
import com.weseethemusic.recommendation.service.HistoryServiceImpl;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/recommendations/history")
@RequiredArgsConstructor
public class HistoryController {

    private final HistoryServiceImpl historyService;

    // 음악 재생 기록 조회
    @GetMapping
    public ResponseDto<List<MusicDto>> getPlayHistory(
        @RequestHeader("X-Member-Id") Long memberId) {
        List<MusicDto> result;

        try {
            result = historyService.getPlayHistory(memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 재생 기록 선택 삭제
    @DeleteMapping("/{musicId}")
    public ResponseDto<Void> deletePlayHistory(@RequestHeader("X-Member-Id") Long memberId,
        @PathVariable("musicId") Long musicId) {
        try {
            historyService.deletePlayHistory(memberId, musicId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200);
    }

}
