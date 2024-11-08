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

    public enum EventType {
        CREATED, UPDATED, DELETED
    }
}