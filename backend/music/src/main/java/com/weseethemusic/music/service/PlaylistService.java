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
}
