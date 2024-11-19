package com.weseethemusic.common.event;

import com.weseethemusic.common.dto.GenreDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class GenreSyncEvent {

    private EventType eventType;
    private GenreDto genre;
    private String sagaId;

    public enum EventType {
        STARTED, COMPLETED, FAILED
    }
}