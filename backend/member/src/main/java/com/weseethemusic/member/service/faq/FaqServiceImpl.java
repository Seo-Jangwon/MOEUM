package com.weseethemusic.member.service.faq;

import com.weseethemusic.member.common.service.EmailService;
import com.weseethemusic.member.dto.faq.FaqDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FaqServiceImpl implements FaqService {

    private final EmailService emailService;
    private final String TO = "noreply.moeum@gmail.com";

    // 1:1 문의 전송
    @Override
    public void sendFaq(FaqDto faqDto) {
        emailService.sendSimpleMessage(TO, faqDto.getTitle(), faqDto.getContent());
    }

}
