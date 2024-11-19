package com.weseethemusic.member.service.jwt;

public interface JwtService {

    String reIssueRefreshToken(String token, String refreshToken);
}
