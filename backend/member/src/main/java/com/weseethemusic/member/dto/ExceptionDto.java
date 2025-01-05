package com.weseethemusic.member.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Builder
public class ExceptionDto {

    private int code;
    private String message;

    public ExceptionDto(int code, String message) {
        super();
        this.code = code;
        this.message = message;
    }

}
