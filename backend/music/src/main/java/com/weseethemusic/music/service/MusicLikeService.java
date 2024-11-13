package com.weseethemusic.music.service;

public interface MusicLikeService {

    void likeMusic(Long memberId, Long musicId);

    void unlikeMusic(Long memberId, Long musicId);

    void likeAlbum(Long memberId, Long albumId);
}
