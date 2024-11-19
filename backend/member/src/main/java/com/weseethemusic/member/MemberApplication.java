package com.weseethemusic.member;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class MemberApplication {

    // post constructor로 스케줄링 로컬 시간 설정
    public static void main(String[] args) {
        SpringApplication.run(MemberApplication.class, args);
    }

}
