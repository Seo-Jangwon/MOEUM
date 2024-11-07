package com.weseethemusic.member.repository.setting;

import com.weseethemusic.member.common.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingRespository extends JpaRepository<Setting, Long> {

  Setting findByMemberId(Long userId);
}
