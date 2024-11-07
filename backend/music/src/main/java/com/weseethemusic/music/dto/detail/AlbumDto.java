package com.weseethemusic.music.dto.detail;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AlbumDto {

    private String name;
    private String image;

}
