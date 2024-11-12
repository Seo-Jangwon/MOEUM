package com.weseethemusic.music.dto.playlist;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class PlaylistMusicResponse {
    private Long id;
    private String title;
    private String albumImage;
    private String duration;
    private List<ArtistResponse> artists;
}