package com.weseethemusic.music.dto.general;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GeneralPlaylistDto {

    private long id;
    private String name;
    private String image;

}
