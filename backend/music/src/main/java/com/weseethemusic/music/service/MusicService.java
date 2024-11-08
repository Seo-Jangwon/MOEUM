package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.general.GeneralPopularMusicDto;
import java.util.List;

public interface MusicService {

    List<GeneralPopularMusicDto> getPopularMusics();
    
}
