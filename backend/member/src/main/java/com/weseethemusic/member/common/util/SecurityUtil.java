package com.weseethemusic.member.common.util;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class SecurityUtil {

    /**
     * SQL 인젝션 공격 패턴 포함 여부 검사
     */
    public static boolean containsSQLInjection(String input) {
        if (input == null) {
            return false;
        }

        // SQL 인젝션 패턴 목록
        String[] sqlPatterns = {
            "\\bSELECT\\b",
            "\\bINSERT\\b",
            "\\bUPDATE\\b",
            "\\bDELETE\\b",
            "\\bDROP\\b",
            "\\bUNION\\b",
            "\\bALTER\\b",
            "\\bCREATE\\b",
            "\\bTRUNCATE\\b",
            "--",            // SQL 주석
            ";",            // 명령어 구분자
            "/\\*.*?\\*/",  // 블록 주석
            "xp_.*",        // xp_cmdshell 등 확장 저장 프로시저
            "'\\s*or\\s*'", // 조건 우회
            "1=1",          // 항상 참인 조건
            "\\bWAITFOR\\b", // 시간 기반 공격
            "\\bEXEC\\b",    // 저장 프로시저 실행
            "@@",           // 시스템 변수
            "0x",           // 16진수 인코딩
            "\\bCHAR\\b",    // CHAR 함수
            "\\bNULL\\b",    // NULL 값
            "\\bCONVERT\\b", // 형변환 함수
        };

        String lowerInput = input.toLowerCase();

        // SQL 키워드 검사
        for (String pattern : sqlPatterns) {
            if (lowerInput.matches(".*" + pattern.toLowerCase() + ".*")) {
                return true;
            }
        }

        // SQL 구문 특수문자 검사
        return lowerInput.contains("'") ||    // 작은따옴표
            lowerInput.contains("\"") ||   // 큰따옴표
            lowerInput.contains(")") ||    // 괄호
            lowerInput.contains("(") ||
            lowerInput.contains("=") ||    // 등호
            lowerInput.contains("|") ||    // 파이프
            lowerInput.contains("&") ||    // 앰퍼샌드
            lowerInput.contains("!") ||    // 느낌표
            lowerInput.contains("$") ||    // 달러
            lowerInput.contains("#");      // 샵
    }

    /**
     * XSS 공격 패턴 포함 여부 검사
     */
    public static boolean containsXSSPayload(String input) {
        if (input == null) {
            return false;
        }

        String[] xssPatterns = {
            "<script[^>]*>[\\s\\S]*?</script>",
            "javascript:",
            "vbscript:",
            "onload=",
            "onerror=",
            "onclick=",
            "onmouseover=",
            "eval\\(",
            "expression\\(",
            "alert\\("
        };

        for (String pattern : xssPatterns) {
            if (input.toLowerCase().matches(".*" + pattern.toLowerCase() + ".*")) {
                return true;
            }
        }
        return false;
    }

    /**
     * HTML 태그 포함 여부 검사
     */
    public static boolean containsHtmlTags(String input) {
        if (input == null) {
            return false;
        }
        return input.matches(".*<[^>]+>.*");
    }

    /**
     * 입력값에 대한 보안 처리
     */
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }

        return input
            .replace("'", "''")          // SQL 이스케이프
            .replace("\\", "\\\\")       // 백슬래시 이스케이프
            .replace(";", "")           // 세미콜론 제거
            .replace("--", "")          // SQL 주석 제거
            .replace("/*", "")          // 블록 주석 시작 제거
            .replace("*/", "")          // 블록 주석 끝 제거
            .replace("&", "&amp;")      // XSS 방지
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\"", "&quot;")
            .replace("'", "&#x27;")
            .replace("/", "&#x2F;");
    }
}