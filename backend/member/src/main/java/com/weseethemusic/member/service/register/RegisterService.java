package com.weseethemusic.member.service.register;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.dto.member.RegisterDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

public interface RegisterService {

    Member registerUser(RegisterDto registerDto);

    int checkUser(String email);

    String sendEmailToken(String email);

    boolean validateEmailToken(String email, String s);
}
