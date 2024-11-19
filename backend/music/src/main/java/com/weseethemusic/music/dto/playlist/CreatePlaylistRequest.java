package com.weseethemusic.music.dto.playlist;

import java.util.List;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class CreatePlaylistRequest {
    private String title;
    private List<Long> musics;
}
