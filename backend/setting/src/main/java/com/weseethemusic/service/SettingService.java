package com.weseethemusic.service;

import com.weseethemusic.dto.PalateRequestDto;
import com.weseethemusic.dto.PalateResponseDto;
import com.weseethemusic.dto.SettingRequestDto;
import com.weseethemusic.dto.SettingResponseDto;
import com.weseethemusic.common.model.Calibration;
import com.weseethemusic.common.model.Setting;
import com.weseethemusic.repository.CalibrationRepository;
import com.weseethemusic.repository.SettingRespository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingService {

  private final SettingRespository settingRespository;
  private final CalibrationRepository calibrationRepository;

  // 환경 설정 편집
  @Transactional
  public void updateSetting(Long userId, SettingRequestDto settingRequestDto) {

    Setting setting = settingRespository.findByMemberId(userId);
    if (setting != null) {
      setting.setVibration(settingRequestDto.isVibration());
      setting.setVisualization(settingRequestDto.isVisualization());
      setting.setBlindness(settingRequestDto.getBlindness());
      setting.setEq_low(settingRequestDto.getEq()[0]);
      setting.setEq_mid(settingRequestDto.getEq()[1]);
      setting.setEq_high(settingRequestDto.getEq()[2]);
      settingRespository.save(setting);
    }
  }

  // 환경 설정 조회
  @Transactional
  public SettingResponseDto getSetting(Long userId) {

    Setting setting = settingRespository.findByMemberId(userId);

    return new SettingResponseDto(
        setting.isVibration(),
        setting.isVisualization(),
        setting.getBlindness(),
        new int[]{setting.getEq_low(), setting.getEq_mid(), setting.getEq_high()}
    );
  }

  // 색상 환경 설정 변경
  @Transactional
  public void updatePalate(Long userId, PalateRequestDto palateRequestDto) {

    Calibration calibration = calibrationRepository.findByMemberId(userId);
    if (calibration != null) {
      calibration.setQ1(palateRequestDto.getQ()[0]);
      calibration.setQ2(palateRequestDto.getQ()[1]);
      calibration.setQ3(palateRequestDto.getQ()[2]);
      calibration.setQ4(palateRequestDto.getQ()[3]);
      calibration.setQ5(palateRequestDto.getQ()[4]);
      calibration.setQ6(palateRequestDto.getQ()[5]);
      calibration.setQ7(palateRequestDto.getQ()[6]);
      calibration.setQ8(palateRequestDto.getQ()[7]);
      calibrationRepository.save(calibration);
    }
  }

  // 색상 환경 설정 조회
  @Transactional
  public PalateResponseDto getPalate(Long userId) {

    Calibration calibration = calibrationRepository.findByMemberId(userId);

    return new PalateResponseDto(
        new String[]{
            calibration.getQ1(),
            calibration.getQ2(),
            calibration.getQ3(),
            calibration.getQ4(),
            calibration.getQ5(),
            calibration.getQ6(),
            calibration.getQ7(),
            calibration.getQ8()
        }
    );
  }

}
