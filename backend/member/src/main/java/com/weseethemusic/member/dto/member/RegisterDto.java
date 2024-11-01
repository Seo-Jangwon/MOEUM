package com.weseethemusic.member.dto.member;

import lombok.Data;

@Data
public class RegisterDto {

    String email;
    String password;
    String nickname;
    int token;
}
