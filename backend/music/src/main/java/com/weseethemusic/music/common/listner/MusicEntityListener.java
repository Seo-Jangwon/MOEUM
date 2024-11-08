package com.weseethemusic.music.common.listner;

import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.common.service.MusicEventPublisher;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MusicEntityListener {

    private final MusicEventPublisher eventPublisher;

    @PostPersist
    public void onPostPersist(Music music) {
        eventPublisher.publishMusicEvent(new MusicSyncEvent(
            MusicSyncEvent.EventType.CREATED,
            MusicDto.fromEntity(music)
        ));
    }

    @PostUpdate
    public void onPostUpdate(Music music) {
        eventPublisher.publishMusicEvent(new MusicSyncEvent(
            MusicSyncEvent.EventType.UPDATED,
            MusicDto.fromEntity(music)
        ));
    }

    @PostRemove
    public void onPostRemove(Music music) {
        eventPublisher.publishMusicEvent(new MusicSyncEvent(
            MusicSyncEvent.EventType.DELETED,
            MusicDto.fromEntity(music)
        ));
    }
}