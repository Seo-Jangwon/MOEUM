package com.weseethemusic.common.event;

import com.weseethemusic.common.dto.AlbumDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AlbumSyncEvent {

    private EventType eventType;
    private AlbumDto album;
    private String sagaId;

    public enum EventType {
        STARTED, COMPLETED, FAILED
    }
}
