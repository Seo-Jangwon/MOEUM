package com.weseethemusic.member.service.login;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.dto.member.LoginRequestDto;
import com.weseethemusic.member.dto.member.LoginResponseDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

public interface LoginService {

    LoginResponseDto login(LoginRequestDto loginRequestDto);

    @Transactional(isolation = Isolation.SERIALIZABLE)
    boolean recoverAccount(Member member);
}
