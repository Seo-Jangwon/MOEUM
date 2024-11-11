package com.weseethemusic.music.dto.search;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ArtistImageDto {

    private long id;
    private String name;
    private String image;

}
