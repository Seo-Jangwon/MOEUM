package com.weseethemusic.member.service.delete;

import com.weseethemusic.member.common.entity.Member;

public interface DeleteService {

    void requestDeleteUser(Long memberId);

    void processDeletedUsers();

    void processDeletedMember(Member member);
}
