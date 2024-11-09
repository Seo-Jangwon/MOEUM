package com.weseethemusic.music.common.listner;

import com.weseethemusic.common.dto.GenreDto;
import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.music.common.entity.Genre;
import com.weseethemusic.music.common.entity.SyncSagaForRecommendation;
import com.weseethemusic.music.common.entity.SyncSagaForRecommendation.OperationType;
import com.weseethemusic.music.common.publisher.MusicEventPublisher;
import com.weseethemusic.music.common.service.SyncSagaService;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class GenreEntityListener {

    private static MusicEventPublisher eventPublisher;
    private static SyncSagaService syncSagaService;

    public GenreEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        GenreEntityListener.eventPublisher = eventPublisher;
        GenreEntityListener.syncSagaService = syncSagaService;
    }

    @PostPersist
    public void onPostPersist(Genre genre) {
        SyncSagaForRecommendation saga = syncSagaService.startGenreSync(genre.getId(),
            OperationType.CREATE);
        eventPublisher.publishGenreEvent(new GenreSyncEvent(
            GenreSyncEvent.EventType.STARTED,
            GenreDto.fromEntity(genre),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostUpdate
    public void onPostUpdate(Genre genre) {
        SyncSagaForRecommendation saga = syncSagaService.startGenreSync(genre.getId(),
            OperationType.UPDATE);
        eventPublisher.publishGenreEvent(new GenreSyncEvent(
            GenreSyncEvent.EventType.STARTED,
            GenreDto.fromEntity(genre),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostRemove
    public void onPostRemove(Genre genre) {
        SyncSagaForRecommendation saga = syncSagaService.startGenreSync(genre.getId(),
            OperationType.DELETE);
        eventPublisher.publishGenreEvent(new GenreSyncEvent(
            GenreSyncEvent.EventType.STARTED,
            GenreDto.fromEntity(genre),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }
}