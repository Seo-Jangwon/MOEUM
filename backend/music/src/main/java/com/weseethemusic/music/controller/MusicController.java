package com.weseethemusic.music.controller;

import com.weseethemusic.music.common.exception.CustomException;
import com.weseethemusic.music.common.exception.ErrorCode;
import com.weseethemusic.music.dto.ResponseDto;
import com.weseethemusic.music.dto.general.GeneralAlbumDto;
import com.weseethemusic.music.dto.general.GeneralDiscographyDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.service.MusicServiceImpl;
import java.util.List;
import java.util.NoSuchElementException;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/musics")
@RequiredArgsConstructor
public class MusicController {

    private final MusicServiceImpl musicService;

    // 좋아요 한 아티스트 목록 조회
    @GetMapping("/artist/like")
    public ResponseDto<List<ArtistImageDto>> getArtistLikes(
        @RequestHeader("X-Member-Id") long memberId) {
        List<ArtistImageDto> result;

        try {
            result = musicService.getArtistLikes(memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 좋아요 한 앨범 목록 조회
    @GetMapping("/album/like")
    public ResponseDto<List<GeneralAlbumDto>> getAlbumLikes(
        @RequestHeader("X-Member-Id") long memberId) {
        List<GeneralAlbumDto> result;

        try {
            result = musicService.getAlbumLikes(memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

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

    // 아티스트 전체 디스코그래피 조회
    @GetMapping("/artist/{artistId}/discography")
    public ResponseDto<List<GeneralDiscographyDto>> getAllDiscography(@PathVariable long artistId) {
        List<GeneralDiscographyDto> result;

        try {
            result = musicService.getAllDiscography(artistId);
        } catch (NoSuchElementException e) {
            throw new CustomException(ErrorCode.NOT_FOUND, "아티스트 정보를 찾을 수 없습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

}
