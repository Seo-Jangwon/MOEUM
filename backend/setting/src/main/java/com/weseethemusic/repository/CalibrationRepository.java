package com.weseethemusic.repository;

import com.weseethemusic.model.Calibration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalibrationRepository extends JpaRepository<Calibration, Long> {

  Calibration findByMemberId(Long userId);
}
