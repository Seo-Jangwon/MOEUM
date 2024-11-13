package com.weseethemusic.recommendation.service.music;

import com.weseethemusic.common.dto.MusicDto;
import org.springframework.transaction.annotation.Transactional;

public interface MusicService {

    boolean existsById(Long musicId);

    void createMusic(MusicDto music);
}
