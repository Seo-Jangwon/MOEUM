package com.weseethemusic.member.common.util;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SecurityUtil {


    /**
     * 이메일 허용 패턴 검증
     */
    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        // 이메일은 로컬파트@도메인 형식만 허용
        return email.matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    }

    /**
     * 패스워드 허용 패턴 검증
     */
    public static boolean isValidPassword(String password) {
        if (password == null) {
            return false;
        }
        // 8-20자, 최소 하나의 문자, 숫자, 특수문자 포함
        return password.matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()_+=])[A-Za-z\\d@$!%*#?&]{8,20}$");
    }

    /**
     * 닉네임 허용 패턴 검증
     */
    public static boolean isValidNickname(String nickname) {
        if (nickname == null) {
            return false;
        }
        // 2-20자의 한글, 영문, 숫자만 허용
        return nickname.matches("^[가-힣a-zA-Z0-9]{2,20}$");
    }

    /**
     * HTML/스크립트 태그 필터링
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }

        // HTML 이스케이프
        return input
            .replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
    }

    /**
     * XSS 취약점 방지를 위한 태그 검사
     */
    public static boolean hasXSSRisk(String input) {
        if (input == null) {
            return false;
        }
        // 스크립트 태그나 이벤트 핸들러가 포함된 경우만 차단
        return input.toLowerCase().matches(".*<script.*>.*</script>.*") ||
            input.toLowerCase().matches(".*\\bon\\w+\\s*=.*");
    }
}