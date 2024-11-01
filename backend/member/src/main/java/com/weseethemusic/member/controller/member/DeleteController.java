package com.weseethemusic.member.controller.member;

import com.weseethemusic.member.service.delite.DeleteService;
import java.util.HashMap;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/members/delete")
public class DeleteController {

    private final DeleteService deleteService;

    @PutMapping
    public ResponseEntity<Map<String, Object>> deleteMember(
        @RequestHeader("X-Member-Id") Long userId) {

        log.info("회원 탈퇴 요청: userId: {}", userId);
        try {
            deleteService.requestDeleteUser(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("data", null);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            // 사용자를 찾을 수 없는 경우
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 401);
            errorResponse.put("message", "유효하지 않은 JWT 토큰입니다.");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);

        } catch (Exception e) {
            // 기타 서버 에러
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "내부 서버 오류");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}