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
    private String errMessage;

    public enum EventType {
        STARTED,
        COMPLETED,
        FAILED_GENRE_NOT_FOUND,       // 장르 없음
        FAILED_ALBUM_NOT_FOUND,       // 앨범 없음
        FAILED_ARTIST_NOT_FOUND,      // 아티스트 없음
        FAILED                        // 기타 에러
    }
}
