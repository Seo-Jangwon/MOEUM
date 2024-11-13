package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.detail.AlbumDetailDto;
import com.weseethemusic.music.dto.detail.ArtistDetailDto;
import com.weseethemusic.music.dto.detail.MusicDetailDto;

public interface MusicDetailService {

    AlbumDetailDto getAlbumDetail(Long albumId);

    ArtistDetailDto getArtistDetail(Long artistId);

    MusicDetailDto getMusicDetail(Long musicId);

}
