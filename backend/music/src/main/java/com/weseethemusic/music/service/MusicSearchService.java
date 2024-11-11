package com.weseethemusic.music.service;

import com.weseethemusic.music.dto.search.MusicDto;
import java.util.List;
import org.springframework.data.domain.Pageable;

public interface MusicSearchService {

    List<MusicDto> searchAllMusics(String keyword, Pageable pageable);

}
