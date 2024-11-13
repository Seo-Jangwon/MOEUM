package com.weseethemusic.member.service.edit;

import com.weseethemusic.member.dto.member.MemberInfoDto;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

public interface EditService {

    @Transactional(isolation = Isolation.READ_COMMITTED)
    MemberInfoDto updateNickname(Long memberId, String nickname);

    boolean checkUser(Long memberId, String password);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    MemberInfoDto updatePassword(Long memberId, String password);

    @Transactional(isolation = Isolation.READ_COMMITTED)
    MemberInfoDto updateProfileImage(Long memberId, MultipartFile file);
}
