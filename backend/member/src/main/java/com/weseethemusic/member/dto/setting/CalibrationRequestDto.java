package com.weseethemusic.member.dto.setting;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class CalibrationRequestDto {

  private String[] q = new String[8];

}
