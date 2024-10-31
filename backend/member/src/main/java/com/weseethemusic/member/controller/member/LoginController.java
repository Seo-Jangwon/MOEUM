package com.weseethemusic.member.controller.member;

import com.weseethemusic.member.common.constants.SecurityConstants;
import com.weseethemusic.member.dto.LoginRequestDto;
import com.weseethemusic.member.dto.LoginResponseDto;
import com.weseethemusic.member.service.login.LoginService;
import jakarta.servlet.http.HttpServletResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/members/login")
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequestDto request,
        HttpServletResponse response) {
        try {
            LoginResponseDto loginResult = loginService.login(request);

            // 리프레시 토큰 쿠키에
            ResponseCookie refreshTokenCookie = ResponseCookie.from(
                    SecurityConstants.REFRESH_TOKEN_COOKIE,
                    loginResult.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();
            response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

            // 성공 응답
            Map<String, Object> successResponse = new HashMap<>();
            successResponse.put("code", 200);
            successResponse.put("data", null);

            // 액세스 토큰 헤더에
            return ResponseEntity.ok()
                .header(SecurityConstants.JWT_HEADER, "Bearer " + loginResult.getAccessToken())
                .body(successResponse);

        } catch (IllegalArgumentException e) {
            // 회원 정보 불일치
            log.info("로그인 실패: 회원 정보 불일치");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 601);
            errorResponse.put("message", "회원 정보가 일치하지 않습니다.");
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (BadCredentialsException e) {
            // 회원 정보 불일치
            log.info("로그인 실패: 회원 정보 없음");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 601);
            errorResponse.put("message", "회원 정보가 없습니다.");
            return ResponseEntity.badRequest().body(errorResponse);

        } catch (Exception e) {
            // 서버 에러
            log.error("로그인 중 예기치 않은 에러 발생", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("code", 500);
            errorResponse.put("message", "내부 서버 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}