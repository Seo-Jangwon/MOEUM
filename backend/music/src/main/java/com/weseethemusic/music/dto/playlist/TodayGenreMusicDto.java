package com.weseethemusic.music.dto.playlist;

import com.weseethemusic.music.dto.detail.ArtistDto;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class TodayGenreMusicDto {

    private long id;
    private String name;
    private String image;
    private String duration;
    private List<ArtistDto> artists;

}
