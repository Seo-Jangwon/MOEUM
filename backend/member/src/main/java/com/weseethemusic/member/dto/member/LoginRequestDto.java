package com.weseethemusic.member.dto.member;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
