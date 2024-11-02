package com.weseethemusic.member.service.setting;

import com.weseethemusic.member.dto.setting.CalibrationRequestDto;
import com.weseethemusic.member.dto.setting.CalibrationResponseDto;
import com.weseethemusic.member.dto.setting.SettingRequestDto;
import com.weseethemusic.member.dto.setting.SettingResponseDto;

public interface SettingService {


    // 환경 설정 편집
    void updateSetting(Long memberId, SettingRequestDto settingRequestDto);

    // 환경 설정 조회
    SettingResponseDto getSetting(Long memberId);

    // 색상 환경 설정 변경
    void updateCalibration(Long memberId, CalibrationRequestDto calibrationRequestDto);

    // 색상 환경 설정 조회
    CalibrationResponseDto getCalibration(Long memberId);

}
