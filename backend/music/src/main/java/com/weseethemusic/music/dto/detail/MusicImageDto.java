package com.weseethemusic.music.dto.detail;

import com.weseethemusic.music.dto.search.ArtistImageDto;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class MusicImageDto {

    private long id;
    private String name;
    private String duration;
    private List<ArtistImageDto> artists;

}
