package com.weseethemusic.recommendation.service;

import com.weseethemusic.common.dto.GenreDto;

public interface GenreService {

    void createGenre(GenreDto genre);

    boolean existsById(int genreId);
}
