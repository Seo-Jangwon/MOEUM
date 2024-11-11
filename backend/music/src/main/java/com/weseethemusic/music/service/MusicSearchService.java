package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.search.AlbumDto;
import com.weseethemusic.music.dto.search.MusicDto;
import com.weseethemusic.music.dto.search.PlaylistDto;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface MusicSearchService {

    List<MusicDto> searchAllMusics(String keyword, Pageable pageable);

    List<PlaylistDto> searchAllPlaylists(String keyword, Pageable pageable);

    List<AlbumDto> searchAllAlbums(String keyword, Pageable pageable);
    
}
