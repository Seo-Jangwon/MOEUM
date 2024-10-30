package com.weseethemusic.repository;

import com.weseethemusic.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRespository extends JpaRepository<Setting, Long> {

  Setting findByMemberId(Long userId);
}
