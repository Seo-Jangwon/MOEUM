package com.weseethemusic.gateway.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {

    private final ErrorCode code;
    private final String message;

    public static CustomException from(CustomException e) {
        return new CustomException(e.getCode(), e.getMessage());
    }
}
