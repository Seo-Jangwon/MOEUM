package com.weseethemusic.music.dto.general;

import com.weseethemusic.music.dto.search.ArtistDto;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class GeneralAlbumDto {

    private long id;
    private String name;
    private String image;
    private List<ArtistDto> artists;

}
