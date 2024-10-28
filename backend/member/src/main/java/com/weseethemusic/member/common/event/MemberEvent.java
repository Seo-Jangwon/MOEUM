package com.weseethemusic.member.common.event;


import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MemberEvent {
    private String eventType;
    private Long memberId;
    private String nickname;
    private String email;
}