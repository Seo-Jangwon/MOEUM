package com.weseethemusic.music.dto.detail;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MusicDetailDto {

    private long musicId;
    private String musicName;
    private long albumId;
    private String albumName;
    private String albumImage;
    private int albumIndex = 1;
    private String genre;
    private String duration;
    private String releaseDate;
    private List<MusicDetailArtistDto> artists;
}
