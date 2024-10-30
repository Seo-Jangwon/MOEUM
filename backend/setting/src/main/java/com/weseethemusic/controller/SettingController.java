package com.weseethemusic.controller;

import com.weseethemusic.dto.PalateRequestDto;
import com.weseethemusic.dto.PalateResponseDto;
import com.weseethemusic.dto.SettingRequestDto;
import com.weseethemusic.dto.SettingResponseDto;
import com.weseethemusic.service.SettingService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/settings")
@RequiredArgsConstructor
public class SettingController {

  private final SettingService settingService;

  // 환경 설정 편집
  @PutMapping
  public ResponseEntity<Object> updateSetting(@RequestHeader("X-User-Id") Long userId, @RequestBody SettingRequestDto settingRequestDto) {
    try {
      settingService.updateSetting(userId, settingRequestDto);

      Map<String, Object> response = new HashMap<>();
      response.put("code", 200);
      response.put("data", null);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // 환경 설정 조회
  @GetMapping
  public ResponseEntity<Object> getSetting(@RequestHeader("X-User-Id") Long userId) {
    try {
      SettingResponseDto settingResponseDto = settingService.getSetting(userId);

      Map<String, Object> response = new HashMap<>();
      response.put("code", 200);
      response.put("data", settingResponseDto);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // 색상 환경 설정 변경
  @PutMapping("/palate")
  public ResponseEntity<Object> updatePalate(@RequestHeader("X-User-Id") Long userId, @RequestBody
      PalateRequestDto palateRequestDto) {
    try {
      settingService.updatePalate(userId, palateRequestDto);
      Map<String, Object> response = new HashMap<>();
      response.put("code", 200);
      response.put("data", null);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

  // 색상 환경 설정 조회
  @GetMapping("/palate")
  public ResponseEntity<Object> getPalate(@RequestHeader("X-User-Id") Long userId) {
    try {
      PalateResponseDto palateResponseDto = settingService.getPalate(userId);
      Map<String, Object> response = new HashMap<>();
      response.put("code", 200);
      response.put("data", palateResponseDto);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
  }

}
