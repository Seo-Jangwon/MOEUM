package com.weseethemusic.common.dto;

import com.weseethemusic.music.common.entity.Genre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenreDto {

    private int id;
    private String name;

    public static GenreDto fromEntity(Genre genre) {
        return GenreDto.builder()
            .id(genre.getId())
            .name(genre.getName())
            .build();
    }
}