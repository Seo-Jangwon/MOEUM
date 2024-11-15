package com.weseethemusic.music.dto.playlist;

import com.weseethemusic.music.common.entity.Genre;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RealTodayGenreDto {

    private int id;
    private String name;
    private String image;

    public static RealTodayGenreDto fromEntity(Genre genre) {
        return RealTodayGenreDto.builder()
            .id(genre.getId())
            .name(genre.getName())
            .image("https://picsum.photos/500/500")
            .build();
    }
}
