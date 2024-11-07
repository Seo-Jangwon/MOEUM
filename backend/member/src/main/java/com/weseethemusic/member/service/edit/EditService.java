package com.weseethemusic.member.service.edit;

import com.weseethemusic.member.dto.member.EditResponseDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

public interface EditService {

    @Transactional(isolation = Isolation.READ_COMMITTED)
    EditResponseDto updateNickname(Long memberId, String nickname);

    boolean checkUser(Long memberId, String password);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    EditResponseDto updatePassword(Long memberId, String password);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    EditResponseDto updateProfileImage(Long memberId, MultipartFile file);
}
