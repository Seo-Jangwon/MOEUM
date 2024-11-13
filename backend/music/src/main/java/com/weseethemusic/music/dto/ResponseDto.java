package com.weseethemusic.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseDto<T> {

    private int code;
    private T data;

    public static <T> ResponseDto<T> res(final int code) {
        return res(code, null);
    }

    public static <T> ResponseDto<T> res(final int code, final T data) {
        return ResponseDto.<T>builder().code(code).data(data).build();
    }

}
