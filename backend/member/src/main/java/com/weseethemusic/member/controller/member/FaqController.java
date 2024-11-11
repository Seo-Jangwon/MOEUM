package com.weseethemusic.member.controller.member;

import com.weseethemusic.member.common.exception.CustomException;
import com.weseethemusic.member.common.exception.ErrorCode;
import com.weseethemusic.member.dto.ResponseDto;
import com.weseethemusic.member.dto.faq.FaqDto;
import com.weseethemusic.member.service.faq.FaqServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/members/faq")
@RequiredArgsConstructor
public class FaqController {

    private final FaqServiceImpl faqService;

    // 1:1 문의 전송
    @PostMapping
    public ResponseDto<Void> sendFaq(@RequestBody FaqDto faqDto) {
        try {
            faqService.sendFaq(faqDto);
        } catch (Exception e) {
            throw new CustomException(ErrorCode.INTERNAL_SERVER_ERROR, "내부 서버 오류");
        }

        return ResponseDto.res(200);
    }

}
