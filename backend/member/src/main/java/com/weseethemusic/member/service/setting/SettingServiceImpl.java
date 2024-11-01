package com.weseethemusic.member.service.setting;

import com.weseethemusic.member.common.entity.Calibration;
import com.weseethemusic.member.common.entity.Setting;
import com.weseethemusic.member.dto.setting.PalateRequestDto;
import com.weseethemusic.member.dto.setting.PalateResponseDto;
import com.weseethemusic.member.dto.setting.SettingRequestDto;
import com.weseethemusic.member.dto.setting.SettingResponseDto;
import com.weseethemusic.member.repository.setting.CalibrationRepository;
import com.weseethemusic.member.repository.setting.SettingRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SettingRespository settingRespository;
    private final CalibrationRepository calibrationRepository;

    // 환경 설정 편집
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateSetting(Long memberId, SettingRequestDto settingRequestDto) {

        Setting setting = settingRespository.findByMemberId(memberId);
        if (setting != null) {
            setting.setVibration(settingRequestDto.isVibration());
            setting.setVisualization(settingRequestDto.isVisualization());
            setting.setBlindness(settingRequestDto.getBlindness());
            setting.setEqLow(settingRequestDto.getEq()[0]);
            setting.setEqMid(settingRequestDto.getEq()[1]);
            setting.setEqHigh(settingRequestDto.getEq()[2]);
            settingRespository.save(setting);
        }
    }

    // 환경 설정 조회
    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public SettingResponseDto getSetting(Long memberId) {

        Setting setting = settingRespository.findByMemberId(memberId);

        return new SettingResponseDto(
            setting.isVibration(),
            setting.isVisualization(),
            setting.getBlindness(),
            new int[]{setting.getEqLow(), setting.getEqMid(), setting.getEqHigh()}
        );
    }

    // 색상 환경 설정 변경
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updatePalate(Long memberId, PalateRequestDto palateRequestDto) {

        Calibration calibration = calibrationRepository.findByMemberId(memberId);
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
    @Override
    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    public PalateResponseDto getPalate(Long memberId) {

        Calibration calibration = calibrationRepository.findByMemberId(memberId);

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
