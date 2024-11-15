package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.playlist.CreatePlaylistRequest;
import com.weseethemusic.music.dto.playlist.PlaylistMusicResponse;
import com.weseethemusic.music.dto.playlist.PlaylistResponse;
import com.weseethemusic.music.dto.playlist.TodayGenreDto;
import java.util.List;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

public interface PlaylistService {

    Long createPlaylist(Long memberId, CreatePlaylistRequest request);

    void deletePlaylist(Long memberId, Long playlistId);

    List<PlaylistMusicResponse> getPlaylistMusics(Long playlistId);

    List<PlaylistResponse> getMyPlaylists(Long memberId);

    List<PlaylistResponse> getMyPlaylistsAll(Long memberId);

    List<PlaylistMusicResponse> updatePlaylist(Long playlistId, String title, List<Long> musicIds);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    List<PlaylistMusicResponse> updatePlaylistOne(Long playlistId, Long musicId);

    void likePlaylist(Long playlistId, Long memberId);

    void disLikePlaylist(Long playlistId, Long memberId);

    void deleteAllPlaylistsByMemberId(Long memberId);

    TodayGenreDto getTodayGenre(int genreId);

    List<PlaylistResponse> likePlaylistList(Long memberId);
}
