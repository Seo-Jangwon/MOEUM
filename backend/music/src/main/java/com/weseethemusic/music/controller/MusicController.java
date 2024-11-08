package com.weseethemusic.music.controller;

import com.weseethemusic.music.common.exception.CustomException;
import com.weseethemusic.music.common.exception.ErrorCode;
import com.weseethemusic.music.dto.ResponseDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.service.MusicServiceImpl;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/musics")
@RequiredArgsConstructor
public class MusicController {

    private final MusicServiceImpl musicService;

    // 인기 30곡 조회
    @GetMapping("/popular")
    public ResponseDto<List<GeneralMusicDto>> getPopularMusics() {
        List<GeneralMusicDto> popularMusicDtos;

        try {
            popularMusicDtos = musicService.getPopularMusics();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, popularMusicDtos);
    }

    // 최신 발매곡 조회
    @GetMapping("/latest")
    public ResponseDto<List<GeneralMusicDto>> getLatestMusics() {
        List<GeneralMusicDto> latestMusicDtos;

        try {
            latestMusicDtos = musicService.getLatestMusics();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, latestMusicDtos);
    }

}
