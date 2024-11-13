package com.weseethemusic.music.controller;

import com.weseethemusic.music.common.exception.CustomException;
import com.weseethemusic.music.common.exception.ErrorCode;
import com.weseethemusic.music.dto.ResponseDto;
import com.weseethemusic.music.service.MusicLikeServiceImpl;
import java.util.Map;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/musics")
@RequiredArgsConstructor
public class MusicLikeController {

    private final MusicLikeServiceImpl musicLikeService;

    // 음악 좋아요 설정
    @PostMapping("/music/like")
    public ResponseDto<Void> likeMusic(@RequestHeader("X-Member-Id") Long memberId,
        @RequestBody Map<String, Long> map) {
        try {
            musicLikeService.likeMusic(memberId, map.get("id"));
        } catch (NoSuchElementException e) {
            throw new CustomException(ErrorCode.NOT_FOUND, "음악이 존재하지 않습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200);
    }

    // 음악 좋아요 해제
    @DeleteMapping("/music/like")
    public ResponseDto<Void> unlikeMusic(@RequestHeader("X-Member-Id") Long memberId,
        @RequestBody Map<String, Long> map) {
        try {
            musicLikeService.unlikeMusic(memberId, map.get("id"));
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200);
    }

    // 앨범 좋아요 설정
    @PostMapping("/album/like")
    public ResponseDto<Void> likeAlbum(@RequestHeader("X-Member-Id") Long memberId,
        @RequestBody Map<String, Long> map) {
        try {
            musicLikeService.likeAlbum(memberId, map.get("id"));
        } catch (NoSuchElementException e) {
            throw new CustomException(ErrorCode.NOT_FOUND, "앨범이 존재하지 않습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200);
    }

    // 앨범 좋아요 해제
    @DeleteMapping("/album/like")
    public ResponseDto<Void> unlikeAlbum(@RequestHeader("X-Member-Id") Long memberId,
        @RequestBody Map<String, Long> map) {
        try {
            musicLikeService.unlikeAlbum(memberId, map.get("id"));
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200);
    }

}
