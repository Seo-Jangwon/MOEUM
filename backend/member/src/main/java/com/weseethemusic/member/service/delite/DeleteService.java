package com.weseethemusic.member.service.delite;

import com.weseethemusic.member.common.entity.Member;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

public interface DeleteService {

    @Transactional(isolation = Isolation.SERIALIZABLE)
    void requestDeleteUser(Long userId);

    @Transactional
    @Scheduled(cron = "0 0 2 * * *") // 매일 새벽 2시에 실행
    void processDeletedUsers();

    @Transactional(isolation = Isolation.SERIALIZABLE)
    void processDeletedMember(Member member);
}
