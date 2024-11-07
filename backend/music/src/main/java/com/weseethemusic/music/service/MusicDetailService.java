package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.detail.AlbumDetailDto;
import com.weseethemusic.music.dto.detail.ArtistDetailDto;

public interface MusicDetailService {

    AlbumDetailDto getAlbumDetail(Long albumId);

    ArtistDetailDto getArtistDetail(Long artistId);

}
