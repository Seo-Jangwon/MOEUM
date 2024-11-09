package com.weseethemusic.common.event;

import com.weseethemusic.common.dto.MusicDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MusicSyncEvent {

    private EventType eventType;
    private MusicDto music;
    private String sagaId;

    public enum EventType {
        STARTED, COMPLETED, FAILED
    }
}
