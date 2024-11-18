package com.weseethemusic.music.dto.general;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GeneralDiscographyDto {

    private Long id;
    private String name;
    private String image;
    private String releaseDate;
    private Boolean isLike;
}
