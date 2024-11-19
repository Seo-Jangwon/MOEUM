package com.weseethemusic.music.common.listener;

import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.common.entity.SyncSagaForRecommendation;
import com.weseethemusic.music.common.entity.SyncSagaForRecommendation.OperationType;
import com.weseethemusic.music.common.publisher.MusicEventPublisher;
import com.weseethemusic.music.common.service.SyncSagaService;
import jakarta.persistence.PostRemove;
import jakarta.persistence.PostUpdate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
public class MusicEntityListener {

    private static MusicEventPublisher eventPublisher;
    private static SyncSagaService syncSagaService;

    public MusicEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        MusicEntityListener.eventPublisher = eventPublisher;
        MusicEntityListener.syncSagaService = syncSagaService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPostPersist(Music music) {
        SyncSagaForRecommendation saga = syncSagaService.startMusicSync(music.getId(),
            OperationType.CREATE);
        eventPublisher.publishMusicEvent(new MusicSyncEvent(
            MusicSyncEvent.EventType.STARTED,
            MusicDto.fromEntity(music),
            saga.getSagaId(),
            null
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostUpdate
    public void onPostUpdate(Music music) {
        SyncSagaForRecommendation saga = syncSagaService.startMusicSync(music.getId(),
            OperationType.UPDATE);
        eventPublisher.publishMusicEvent(new MusicSyncEvent(
            MusicSyncEvent.EventType.STARTED,
            MusicDto.fromEntity(music),
            saga.getSagaId(),
            null
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostRemove
    public void onPostRemove(Music music) {
        SyncSagaForRecommendation saga = syncSagaService.startMusicSync(music.getId(),
            OperationType.DELETE);
        eventPublisher.publishMusicEvent(new MusicSyncEvent(
            MusicSyncEvent.EventType.STARTED,
            MusicDto.fromEntity(music),
            saga.getSagaId(),
            null
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }
}