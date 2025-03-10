package com.weseethemusic.music.service.musicVisualization;

import com.weseethemusic.music.dto.visualization.LyricListDto;
import com.weseethemusic.music.dto.visualization.MusicVisualizationDto;

public interface MusicVisualizationService {

    MusicVisualizationDto getMusicVisualization(long musicId);

    LyricListDto getMusicLyrics(long musicId);

}
