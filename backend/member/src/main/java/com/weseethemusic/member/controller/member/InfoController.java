package com.weseethemusic.member.controller.member;

import com.weseethemusic.member.dto.member.MemberInfoDto;
import com.weseethemusic.member.service.info.InfoService;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members/info")
public class InfoController {

    private final InfoService infoService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getInfo(@RequestHeader("X-Member-Id") Long memberId) {
        Map<String, Object> response = new HashMap<>();

        try {
            MemberInfoDto data = infoService.getInfo(memberId);

            response.put("code", 200);
            response.put("data", data);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", "내부 서버 오류");
            return ResponseEntity.status(500).body(response);
        }

    }

}
