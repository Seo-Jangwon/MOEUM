package com.weseethemusic.recommendation.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    EMAIL_ALREADY_EXISTS(402),
    EMAIL_FORMAT_ERROR(405),
    NICKNAME_ERROR(406),
    AUTHENTICATION_ERROR(407),
    ID_DELETED(408),
    ID_NOT_EXIST(409),
    NOT_AVAILABLE_GUID(410),

    NOT_AFFORDABLE(503),
    NOT_AVAILABLE_REPORT_TYPE(504),

    UNAUTHORIZED(401),
    FORBIDDEN(403),
    NOT_FOUND(404),
    INTERNAL_SERVER_ERROR(500),
    BAD_GATEWAY(502);

    private final int status;

}
