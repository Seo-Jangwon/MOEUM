package com.weseethemusic.music.dto.search;

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
    private String albumImage;
    private List<ArtistDto> artists;

}
