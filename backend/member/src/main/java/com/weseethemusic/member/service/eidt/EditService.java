package com.weseethemusic.member.service.eidt;

import com.weseethemusic.member.dto.member.EditResponseDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

public interface EditService {

    @Transactional(isolation = Isolation.READ_COMMITTED)
    EditResponseDto updateNickname(Long userId, String nickname);

    boolean checkUser(Long userId, String password);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    EditResponseDto updatePassword(Long userId, String password);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    EditResponseDto updateProfileImage(Long userId, MultipartFile file);
}
