package com.weseethemusic.common.dto;

import com.weseethemusic.music.common.entity.Artist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArtistDto {

    private long id;
    private String name;
    private String imageName;

    public static ArtistDto fromEntity(Artist artist) {
        return ArtistDto.builder()
            .id(artist.getId())
            .name(artist.getName())
            .imageName(artist.getImageName())
            .build();
    }
}
