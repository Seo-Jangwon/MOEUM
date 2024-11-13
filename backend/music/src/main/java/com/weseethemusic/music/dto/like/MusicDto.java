package com.weseethemusic.music.dto.like;

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
    private long albumId;
    private String albumName;
    private String albumImage;
    private List<ArtistDto> artists;

}
