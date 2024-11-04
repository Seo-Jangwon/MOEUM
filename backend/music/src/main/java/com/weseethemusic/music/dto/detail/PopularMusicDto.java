package com.weseethemusic.music.dto.detail;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PopularMusicDto {

    private long id;
    private String musicName;
    private String musicDuration;

}
