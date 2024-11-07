package com.weseethemusic.member.dto.member;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class EditRequestDto {

    String nickname;
    MultipartFile profileImage;
    String password;
}
