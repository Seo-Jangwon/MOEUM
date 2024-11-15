package com.weseethemusic.music.controller;

import com.weseethemusic.music.dto.playlist.CreatePlaylistRequest;
import com.weseethemusic.music.dto.playlist.LikeRequest;
import com.weseethemusic.music.dto.playlist.PlaylistMusicResponse;
import com.weseethemusic.music.dto.playlist.PlaylistResponse;
import com.weseethemusic.music.dto.playlist.UpdatePlaylistRequest;
import com.weseethemusic.music.service.PlaylistService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/musics/playlist")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createPlaylist(
        @RequestHeader("X-Member-Id") Long memberId,
        @RequestBody CreatePlaylistRequest request) {

        Map<String, Object> response = new HashMap<>();
        try {
            Long playlistId = playlistService.createPlaylist(memberId, request);
            response.put("code", 200);
            response.put("data", playlistId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/delete/{playlistId}")
    public ResponseEntity<Map<String, Object>> deletePlaylist(
        @RequestHeader("X-Member-Id") Long memberId,
        @PathVariable Long playlistId) {

        Map<String, Object> response = new HashMap<>();
        try {
            playlistService.deletePlaylist(memberId, playlistId);
            response.put("code", 200);
            response.put("data", null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/detail/{playlistId}")
    public ResponseEntity<Map<String, Object>> getPlaylistMusic(
        @RequestHeader(value = "X-Member-Id", required = false) Long memberId,
        @PathVariable Long playlistId) {

        log.info("회원 {}가 플레이리스트 조회", memberId);

        Map<String, Object> response = new HashMap<>();
        try {
            List<PlaylistMusicResponse> musics = playlistService.getPlaylistMusics(playlistId);
            Map<String, Object> data = new HashMap<>();
            data.put("musics", musics);

            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/create")
    public ResponseEntity<Map<String, Object>> getMyPlaylists(
        @RequestHeader("X-Member-Id") Long memberId) {

        Map<String, Object> response = new HashMap<>();
        try {
            List<PlaylistResponse> musics = playlistService.getMyPlaylists(memberId);
            Map<String, Object> data = new HashMap<>();
            data.put("musics", musics);

            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMyPlaylistsAll(
        @RequestHeader("X-Member-Id") Long memberId) {

        Map<String, Object> response = new HashMap<>();
        try {
            List<PlaylistResponse> musics = playlistService.getMyPlaylistsAll(memberId);
            Map<String, Object> data = new HashMap<>();
            data.put("musics", musics);

            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<Map<String, Object>> updatePlaylist(
        @PathVariable Long playlistId, @RequestBody UpdatePlaylistRequest request) {

        Map<String, Object> response = new HashMap<>();
        try {
            List<PlaylistMusicResponse> musics = playlistService.updatePlaylist(playlistId,
                request.getTitle(), request.getMusics());
            Map<String, Object> data = new HashMap<>();
            data.put("musics", musics);

            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{playlistId}/add/{musicId}")
    public ResponseEntity<Map<String, Object>> addOnPlaylist(
        @PathVariable Long playlistId, @PathVariable Long musicId) {

        Map<String, Object> response = new HashMap<>();
        try {
            List<PlaylistMusicResponse> musics = playlistService.updatePlaylistOne(playlistId,
                musicId);
            Map<String, Object> data = new HashMap<>();
            data.put("musics", musics);

            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/like")
    public ResponseEntity<Map<String, Object>> likePlaylist(@RequestBody LikeRequest
        likeRequest,
        @RequestHeader("X-Member-Id") Long memberId) {
        Map<String, Object> response = new HashMap<>();
        try {
            playlistService.likePlaylist(likeRequest.getId(), memberId);
            Map<String, Object> data = new HashMap<>();
            response.put("code", 200);
            response.put("data", data);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/like")
    public ResponseEntity<Map<String, Object>> disLikePlaylist(
        @RequestBody LikeRequest likeRequest, @RequestHeader("X-Member-Id") Long memberId) {
        Map<String, Object> response = new HashMap<>();
        try {
            playlistService.disLikePlaylist(likeRequest.getId(), memberId);
            Map<String, Object> data = new HashMap<>();
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
