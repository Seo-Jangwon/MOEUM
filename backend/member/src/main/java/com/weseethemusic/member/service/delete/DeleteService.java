package com.weseethemusic.member.service.delete;


import com.weseethemusic.member.common.entity.Member;

public interface DeleteService {

    void requestDeleteMember(Long memberId);

    void processDeletedMembers();

    void startDeleteMember(Member member);

    void handleDeleteMemberFailed(Long sagaId, Long memberId);
}
