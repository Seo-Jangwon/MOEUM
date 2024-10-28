package com.weseethemusic.member.service;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.dto.RegisterDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

public interface MemberService {

    Member registerUser(RegisterDto registerDto);

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    boolean checkUser(String email);

    String sendEmailToken(String email);

    void sendSimpleMessage(String to, String subject, String text);

    boolean validateEmailToken(String email, String s);
}
