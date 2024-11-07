package com.weseethemusic.member.service.setting;

import com.weseethemusic.member.dto.setting.PalateRequestDto;
import com.weseethemusic.member.dto.setting.PalateResponseDto;
import com.weseethemusic.member.dto.setting.SettingRequestDto;
import com.weseethemusic.member.dto.setting.SettingResponseDto;
import jakarta.transaction.Transactional;

public interface SettingService {


    // 환경 설정 편집
    void updateSetting(Long userId, SettingRequestDto settingRequestDto);

    // 환경 설정 조회
    SettingResponseDto getSetting(Long userId);

    // 색상 환경 설정 변경
    void updatePalate(Long userId, PalateRequestDto palateRequestDto);

    // 색상 환경 설정 조회
    PalateResponseDto getPalate(Long userId);
}
