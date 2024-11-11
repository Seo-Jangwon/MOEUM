package com.weseethemusic.recommendation.service.album;

import com.weseethemusic.common.dto.AlbumDto;

public interface AlbumService {

    boolean existsById(long albumId);

    void createAlbum(AlbumDto album);
}
