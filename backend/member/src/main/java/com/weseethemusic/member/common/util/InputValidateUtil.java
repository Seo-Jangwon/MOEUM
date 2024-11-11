package com.weseethemusic.member.common.util;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class InputValidateUtil {

    /**
     * 이메일 유효성 검사
     */
    public static void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력값입니다.");
        }

        if (!SecurityUtil.isValidEmail(email)) {
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        if (SecurityUtil.hasXSSRisk(email)) {
            log.warn("XSS 위험 감지: {}", email);
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }
    }

    /**
     * 닉네임 유효성 검사
     */
    public static void validateNickname(String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 필수 입력값입니다.");
        }

        if (!SecurityUtil.isValidNickname(nickname)) {
            throw new IllegalArgumentException("닉네임은 2-20자의 한글, 영문, 숫자만 허용됩니다.");
        }

        if (SecurityUtil.hasXSSRisk(nickname)) {
            log.warn("XSS 위험 감지: {}", nickname);
            throw new IllegalArgumentException("유효하지 않은 닉네임 형식입니다.");
        }
    }

    /**
     * 비밀번호 유효성 검사
     */
    public static void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력값입니다.");
        }

        if (!SecurityUtil.isValidPassword(password)) {
            throw new IllegalArgumentException("비밀번호는 8-20자이며, 영문자, 숫자, 특수문자를 포함해야 합니다.");
        }
    }
}
