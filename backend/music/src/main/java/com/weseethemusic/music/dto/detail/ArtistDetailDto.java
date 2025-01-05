package com.weseethemusic.music.dto.detail;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtistDetailDto {

    private String name;
    private String image;
    private List<DiscographyAlbumDto> discography;
    private List<PopularMusicDto> popular;
    private Boolean isLike;

}
