package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.like.MusicDto;
import java.util.List;

public interface MusicLikeService {

    void likeMusic(Long memberId, Long musicId);

    void unlikeMusic(Long memberId, Long musicId);

    void likeAlbum(Long memberId, Long albumId);

    void unlikeAlbum(Long memberId, Long albumId);

    void likeArtist(Long memberId, Long artistId);

    void unlikeArtist(Long memberId, Long artistId);

    List<MusicDto> getMyLikeMusics(Long memberId);

}
