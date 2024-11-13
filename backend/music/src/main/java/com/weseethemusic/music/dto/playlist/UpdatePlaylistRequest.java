package com.weseethemusic.music.dto.playlist;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UpdatePlaylistRequest {

    private String title;
    private List<Long> musics;
}
