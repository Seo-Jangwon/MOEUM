package com.weseethemusic.member.service.register;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.dto.RegisterDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

public interface RegisterService {

    Member registerUser(RegisterDto registerDto);

    @Transactional(readOnly = true, isolation = Isolation.READ_COMMITTED)
    int checkUser(String email);

    String sendEmailToken(String email);

    void sendSimpleMessage(String to, String subject, String text);

    boolean validateEmailToken(String email, String s);
}
