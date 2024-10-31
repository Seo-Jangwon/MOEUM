package com.weseethemusic.member.controller;

import com.weseethemusic.member.dto.EditRequestDto;
import com.weseethemusic.member.dto.EditResponseDto;
import com.weseethemusic.member.service.eidt.EditService;
import jakarta.persistence.EntityNotFoundException;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/members/edit")
public class EditController {

    private final EditService editService;

    @PutMapping("/nickname")
    public ResponseEntity<Map<String, Object>> updateNickname(
        @RequestHeader("X-USER-ID") Long userId,
        @RequestBody EditRequestDto editRequestDto) {

        Map<String, Object> response = new HashMap<>();

        try {
            EditResponseDto data = editService.updateNickname(userId, editRequestDto.getNickname());

            response.put("code", 200);
            response.put("data", data);

            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            response.put("code", 401);
            response.put("message", "유효하지 않은 JWT 토큰입니다.");
            return ResponseEntity.status(401).body(response);

        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/checkuser")
    public ResponseEntity<Map<String, Object>> checkUser(
        @RequestHeader("X-USER-ID") Long userId,
        @RequestBody EditRequestDto editRequestDto
    ) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean result = editService.checkUser(userId, editRequestDto.getPassword());

            if (result) {
                response.put("code", 200);
                response.put("data", "비밀번호 확인");
            } else {
                response.put("code", 602);
                response.put("data", "비밀번호가 일치하지 않습니다.");
            }
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping(value = "/password")
    public ResponseEntity<Map<String, Object>> updatePassword(
        @RequestHeader("X-USER-ID") Long userId,
        EditRequestDto editRequestDto) {

        Map<String, Object> response = new HashMap<>();

        try {
            EditResponseDto updatedMember = editService.updatePassword(userId,
                editRequestDto.getPassword());

            Map<String, Object> data = new HashMap<>();
            data.put("email", updatedMember.getEmail());
            data.put("nickname", updatedMember.getNickname());
            data.put("profileImage", updatedMember.getProfileImage());

            response.put("code", 200);
            response.put("data", data);

            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            response.put("code", 401);
            response.put("message", "유효하지 않은 JWT 토큰입니다.");
            return ResponseEntity.status(401).body(response);

        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }

    @PutMapping(value = "/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProfileImage(
        @RequestHeader("X-USER-ID") Long userId,
        @ModelAttribute EditRequestDto editRequestDto) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (editRequestDto.getProfileImage() == null || editRequestDto.getProfileImage()
                .isEmpty()) {
                response.put("code", 701);
                response.put("message", "이미지 파일이 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            EditResponseDto updatedMember = editService.updateProfileImage(
                userId, editRequestDto.getProfileImage());

            response.put("code", 200);
            response.put("data", updatedMember);

            return ResponseEntity.ok(response);

        } catch (EntityNotFoundException e) {
            response.put("code", 401);
            response.put("message", "유효하지 않은 JWT 토큰입니다.");
            return ResponseEntity.status(401).body(response);

        } catch (RuntimeException e) {
            if (e.getMessage().equals("파일 업로드 중 이상이 생겼습니다.")) {
                response.put("code", 701);
                response.put("message", e.getMessage());
                return ResponseEntity.status(500).body(response);
            }
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }
    }
}
