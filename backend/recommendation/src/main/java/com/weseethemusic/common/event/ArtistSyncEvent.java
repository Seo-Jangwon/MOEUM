package com.weseethemusic.common.event;


import com.weseethemusic.common.dto.ArtistDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ArtistSyncEvent {

    private EventType eventType;
    private ArtistDto artist;
    private String sagaId;

    public enum EventType {
        STARTED, COMPLETED, FAILED
    }
}