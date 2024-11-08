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

        // SQL 인젝션 패턴 검사
        if (SecurityUtil.containsSQLInjection(email)) {
            log.warn("SQL 인젝션 시도 감지: {}", email);
            throw new IllegalArgumentException("유효하지 않은 이메일 형식입니다.");
        }

        // 이메일 형식 및 길이 검증
        if (!email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") ||
            email.length() > 255) {
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

        // SQL 인젝션 패턴 검사
        if (SecurityUtil.containsSQLInjection(nickname)) {
            log.warn("SQL 인젝션 시도 감지: {}", nickname);
            throw new IllegalArgumentException("유효하지 않은 닉네임 형식입니다.");
        }

        // 닉네임 길이 및 문자 검증
        if (nickname.length() < 2 || nickname.length() > 20 ||
            !nickname.matches("^[가-힣a-zA-Z0-9\\s]+$")) {
            throw new IllegalArgumentException("닉네임은 2-20자의 한글, 영문, 숫자만 허용됩니다.");
        }
    }

    /**
     * 비밀번호 유효성 검사
     */
    public static void validatePassword(String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력값입니다.");
        }

        // 비밀번호 복잡성 검증
        if (!password.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,20}$")) {
            throw new IllegalArgumentException("비밀번호는 8-20자이며, 영문자, 숫자, 특수문자를 포함해야 합니다.");
        }
    }
}
