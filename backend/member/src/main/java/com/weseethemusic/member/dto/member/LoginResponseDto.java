package com.weseethemusic.member.dto.member;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class LoginResponseDto {

    private String accessToken;
    private String refreshToken;
    private String message;
}
