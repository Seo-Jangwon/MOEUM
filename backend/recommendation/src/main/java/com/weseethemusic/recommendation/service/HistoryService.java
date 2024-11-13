package com.weseethemusic.recommendation.service;

import com.weseethemusic.recommendation.dto.history.MusicDto;
import java.util.List;

public interface HistoryService {

    List<MusicDto> getPlayHistory(Long memberId);

    void deletePlayHistory(Long memberId, Long musicId);

    void addPlayHistory(Long memberId, Long musicId);

}
