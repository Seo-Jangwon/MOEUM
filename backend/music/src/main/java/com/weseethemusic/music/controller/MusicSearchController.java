package com.weseethemusic.music.controller;

import com.weseethemusic.music.common.exception.CustomException;
import com.weseethemusic.music.common.exception.ErrorCode;
import com.weseethemusic.music.dto.ResponseDto;
import com.weseethemusic.music.dto.search.AlbumDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.dto.search.MusicDto;
import com.weseethemusic.music.dto.search.PlaylistDto;
import com.weseethemusic.music.dto.search.SearchDto;
import com.weseethemusic.music.service.MusicSearchServiceImpl;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/musics/search")
@RequiredArgsConstructor
public class MusicSearchController {

    private final MusicSearchServiceImpl musicSearchService;

    // 음악 검색
    @GetMapping
    public ResponseDto<SearchDto> searchMusic(@RequestParam("keyword") String keyword) {
        SearchDto result;

        try {
            result = musicSearchService.searchMusic(keyword);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, e.getMessage());
        }

        return ResponseDto.res(200, result);
    }

    // 음악 모두 보기 검색
    @GetMapping("/music")
    public ResponseDto<List<MusicDto>> searchAllMusics(@RequestParam("keyword") String keyword,
        Pageable pageable) {
        List<MusicDto> result;

        try {
            result = musicSearchService.searchAllMusics(keyword, pageable);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 플레이리스트 모두 보기 검색
    @GetMapping("/playlist")
    public ResponseDto<List<PlaylistDto>> searchAllPlaylists(
        @RequestParam("keyword") String keyword, Pageable pageable) {
        List<PlaylistDto> result;

        try {
            result = musicSearchService.searchAllPlaylists(keyword, pageable);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 앨범 모두 보기 검색
    @GetMapping("/album")
    public ResponseDto<List<AlbumDto>> searchAllAlbums(@RequestParam("keyword") String keyword,
        Pageable pageable) {
        List<AlbumDto> result;

        try {
            result = musicSearchService.searchAllAlbums(keyword, pageable);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

    // 아티스트 모두 보기 검색
    @GetMapping("/artist")
    public ResponseDto<List<ArtistImageDto>> searchAllArtists(
        @RequestParam("keyword") String keyword, Pageable pageable) {
        List<ArtistImageDto> result;

        try {
            result = musicSearchService.searchAllArtists(keyword, pageable);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200, result);
    }

}
