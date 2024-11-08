package com.weseethemusic.music.common.listner;

import com.weseethemusic.common.dto.GenreDto;
import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.music.common.entity.Genre;
import com.weseethemusic.music.common.service.MusicEventPublisher;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GenreEntityListener {

    private final MusicEventPublisher eventPublisher;

    @PostPersist
    public void onPostPersist(Genre genre) {
        eventPublisher.publishGenreEvent(new GenreSyncEvent(
            GenreSyncEvent.EventType.CREATED,
            GenreDto.fromEntity(genre)
        ));
    }

    @PostUpdate
    public void onPostUpdate(Genre genre) {
        eventPublisher.publishGenreEvent(new GenreSyncEvent(
            GenreSyncEvent.EventType.UPDATED,
            GenreDto.fromEntity(genre)
        ));
    }

    @PostRemove
    public void onPostRemove(Genre genre) {
        eventPublisher.publishGenreEvent(new GenreSyncEvent(
            GenreSyncEvent.EventType.DELETED,
            GenreDto.fromEntity(genre)
        ));
    }
}