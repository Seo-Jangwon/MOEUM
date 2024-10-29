package com.weseethemusic.member.controller;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.util.JwtUtil;
import com.weseethemusic.member.dto.RegisterDto;
import com.weseethemusic.member.service.MemberService;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/members")
public class MemberController {

    private final JwtUtil jwtUtil;
    private final MemberService memberService;

    public MemberController(MemberService usersService,
        JwtUtil jwtUtil) {
        this.memberService = usersService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * 회원가입을 위한 인증번호 이메일로 전송
     *
     * @param registerDto 이메일 정보를 담은 DTO
     * @return 인증번호 전송 결과
     */
    @PostMapping("/register/token")
    public ResponseEntity<Map<String, Object>> registerUserEmail(
        @RequestBody RegisterDto registerDto) {
        log.info("회원가입 이메일 인증 요청: 이메일 {}", registerDto.getEmail());

        Map<String, Object> response = new HashMap<>();
        String result = memberService.sendEmailToken(registerDto.getEmail());
        response.put("message", result);
        response.put("data", new Object[]{});
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    /**
     * 회원가입 시 전송된 인증번호 확인
     *
     * @param registerDto 인증번호를 담은 DTO
     * @return 인증번호 확인 결과
     */
    @PostMapping("/register/check/token")
    public ResponseEntity<Map<String, Object>> checkAuthNumber(
        @RequestBody RegisterDto registerDto) {
        Map<String, Object> response = new HashMap<>();

        boolean isValid = memberService.validateEmailToken(registerDto.getEmail(),
            String.valueOf(registerDto.getToken()));

        if (isValid) {
            response.put("message", "인증 완료");
            response.put("data", new Object[]{});
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            response.put("message", "인증 실패 (잘못된 인증번호 또는 만료)");
            response.put("data", new Object[]{});
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * 회원 가입 처리
     *
     * @param registerDto 회원 가입에 필요한 정보 DTO
     * @return 회원 가입 결과
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody RegisterDto registerDto) {
        log.info("회원 가입 요청: 이메일 {}", registerDto.getEmail());

        Map<String, Object> response = new HashMap<>();
        try {
            Member savedUsers = memberService.registerUser(registerDto);
            log.info("회원가입 성공");
            response.put("message", "회원가입 성공");
            response.put("data", new Object[]{});
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalStateException e) {
            log.info("회원가입 불가: {}", e.getMessage());
            response.put("message", e.getMessage());
            response.put("data", new Object[]{});
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            log.error("회원가입 실패", e);
            response.put("message", "회원가입 실패: " + e.getMessage());
            response.put("data", new Object[]{});
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
