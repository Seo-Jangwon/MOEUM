package com.weseethemusic.recommendation.service.artist;

import com.weseethemusic.common.dto.ArtistDto;

public interface ArtistService {

    void createArtist(ArtistDto artist);

    boolean existsById(long id);
}
