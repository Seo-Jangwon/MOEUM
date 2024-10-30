package com.weseethemusic.member.controller;

import com.weseethemusic.member.dto.EditRequestDto;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/members/edit")
public class EditController {

//    @PutMapping("/nickname")
//    public ResponseEntity<Map<String, Object>> updateNickname(
//        @RequestHeader("X-USER-ID") Long userId, @RequestBody
//    EditRequestDto editRequestDto) {
//
//    }

}
