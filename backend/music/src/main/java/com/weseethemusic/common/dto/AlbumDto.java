package com.weseethemusic.common.dto;

import com.weseethemusic.music.common.entity.Album;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.Date;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumDto {

    private long id;
    private String name;
    private Date releaseDate;
    private String imageName;

    public static AlbumDto fromEntity(Album album) {
        return AlbumDto.builder()
            .id(album.getId())
            .name(album.getName())
            .releaseDate(album.getReleaseDate())
            .imageName(album.getImageName())
            .build();
    }
}
