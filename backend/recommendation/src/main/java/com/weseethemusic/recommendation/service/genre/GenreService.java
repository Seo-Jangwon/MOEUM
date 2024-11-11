package com.weseethemusic.recommendation.service.genre;

import com.weseethemusic.common.dto.GenreDto;

public interface GenreService {

    void createGenre(GenreDto genre);

    boolean existsById(int genreId);
}
