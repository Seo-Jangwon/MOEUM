package com.weseethemusic.music.dto.detail;

import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MusicDto {

    private long id;
    private String name;
    private String duration;
    private List<ArtistDto> artists;

}
