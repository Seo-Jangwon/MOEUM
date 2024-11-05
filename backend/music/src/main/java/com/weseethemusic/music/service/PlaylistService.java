package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.playlist.CreatePlaylistRequest;
import com.weseethemusic.music.dto.playlist.PlaylistMusicResponse;
import com.weseethemusic.music.dto.playlist.PlaylistResponse;
import java.util.List;

public interface PlaylistService {

    Long createPlaylist(Long memberId, CreatePlaylistRequest request);

    void deletePlaylist(Long memberId, Long playlistId);

    List<PlaylistMusicResponse> getPlaylistMusics(Long playlistId);

    List<PlaylistResponse> getMyPlaylists(Long memberId);

    List<PlaylistResponse> getMyPlaylistsAll(Long memberId);

    List<PlaylistMusicResponse> updatePlaylist(Long playlistId, String title, List<Long> musicIds);

    void likePlaylist(Long playlistId, Long memberId);

    void disLikePlaylist(Long playlistId, Long memberId);

}
