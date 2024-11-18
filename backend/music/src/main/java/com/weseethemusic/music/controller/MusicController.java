package com.weseethemusic.music.controller;

import com.weseethemusic.music.common.exception.CustomException;
import com.weseethemusic.music.common.exception.ErrorCode;
import com.weseethemusic.music.dto.ResponseDto;
import com.weseethemusic.music.dto.general.GeneralAlbumDto;
import com.weseethemusic.music.dto.general.GeneralDiscographyDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.dto.general.GeneralPlaylistDto;
import com.weseethemusic.music.dto.playlist.TodayGenreDto;
import com.weseethemusic.music.dto.playlist.TodayGenreListDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.service.music.MusicService;
import com.weseethemusic.music.service.playlist.PlaylistService;
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

    private final MusicService musicService;
    private final PlaylistService playlistService;

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
    public ResponseDto<List<GeneralMusicDto>> getPopularMusics(
        @RequestHeader(value = "X-Member-Id", required = false) Long memberId) {
        List<GeneralMusicDto> popularMusicDtos;

        try {
            popularMusicDtos = musicService.getPopularMusics(memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, popularMusicDtos);
    }

    // 최신 발매곡 조회
    @GetMapping("/latest")
    public ResponseDto<List<GeneralMusicDto>> getLatestMusics(
        @RequestHeader(value = "X-Member-Id", required = false) Long memberId) {
        List<GeneralMusicDto> latestMusicDtos;

        try {
            latestMusicDtos = musicService.getLatestMusics(memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, latestMusicDtos);
    }

    // 인기 플레이리스트 조회
    @GetMapping("/popular/playlist")
    public ResponseDto<List<GeneralPlaylistDto>> getPopularPlaylists(
        @RequestHeader(value = "X-Member-Id", required = false) Long memberId) {
        List<GeneralPlaylistDto> popularPlaylistDtos;

        try {
            popularPlaylistDtos = musicService.getPopularPlaylists(memberId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, popularPlaylistDtos);
    }

    // 아티스트 전체 디스코그래피 조회
    @GetMapping("/artist/{artistId}/discography")
    public ResponseDto<List<GeneralDiscographyDto>> getAllDiscography(@PathVariable long artistId,
        @RequestHeader(value = "X-Member-Id", required = false) Long memberId) {
        List<GeneralDiscographyDto> result;

        try {
            result = musicService.getAllDiscography(artistId, memberId);
        } catch (NoSuchElementException e) {
            throw new CustomException(ErrorCode.NOT_FOUND, "아티스트 정보를 찾을 수 없습니다.");
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 전체 장르 목록 조회
    @GetMapping("/todaygenre")
    public ResponseDto<TodayGenreListDto> getGenres() {
        TodayGenreListDto result;

        try {
            result = musicService.getGenres();
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 오늘의 장르 조회
    @GetMapping("/todaygenre/{genreId}")
    public ResponseDto<TodayGenreDto> getTodayGenre(@PathVariable int genreId) {
        TodayGenreDto result;

        try {
            result = playlistService.getTodayGenre(genreId);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

}
