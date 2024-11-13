package com.weseethemusic.music.common.handler;

import com.weseethemusic.music.common.exception.CustomException;
import com.weseethemusic.music.dto.ExceptionDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(annotations = RestController.class)
public class ExceptionHandler {

    @org.springframework.web.bind.annotation.ExceptionHandler(CustomException.class)
    protected ResponseEntity<ExceptionDto> handleException(CustomException e) {
        return new ResponseEntity<>(new ExceptionDto(e.getCode().getStatus(), e.getMessage()),
            HttpStatus.valueOf(e.getCode().getStatus()));
    }

}
