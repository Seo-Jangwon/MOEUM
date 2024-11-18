package com.weseethemusic.music.dto.general;

import com.weseethemusic.music.dto.detail.ArtistDto;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class GeneralMusicDto {

    private long id;
    private String name;
    private String image;
    private List<ArtistDto> artists;
    private Boolean isLike;

}
