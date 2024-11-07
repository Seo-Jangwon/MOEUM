package com.weseethemusic.member.dto.setting;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SettingResponseDto {

  private boolean vibration;
  private boolean visualization;
  private int blindness;
  private int[] eq = new int[3];

}
