package com.weseethemusic.member.service.info;

import com.weseethemusic.member.dto.member.MemberInfoDto;

public interface InfoService {

    MemberInfoDto getInfo(Long memberId);
}
