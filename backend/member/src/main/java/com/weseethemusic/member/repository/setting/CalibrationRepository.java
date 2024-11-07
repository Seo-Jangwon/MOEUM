package com.weseethemusic.member.repository.setting;


import com.weseethemusic.member.common.entity.Calibration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalibrationRepository extends JpaRepository<Calibration, Long> {

  Calibration findByMemberId(Long userId);
}
