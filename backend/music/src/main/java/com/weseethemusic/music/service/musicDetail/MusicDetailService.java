package com.weseethemusic.music.service.musicDetail;

import com.weseethemusic.music.dto.detail.AlbumDetailDto;
import com.weseethemusic.music.dto.detail.ArtistDetailDto;
import com.weseethemusic.music.dto.detail.MusicDetailDto;

public interface MusicDetailService {

    AlbumDetailDto getAlbumDetail(Long albumId, Long memberId);

    ArtistDetailDto getArtistDetail(Long artistId, Long memberId);

    MusicDetailDto getMusicDetail(Long musicId, Long memberId);

}
