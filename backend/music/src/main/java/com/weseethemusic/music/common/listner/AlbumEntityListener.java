package com.weseethemusic.music.common.listner;


import com.weseethemusic.common.dto.AlbumDto;
import com.weseethemusic.common.event.AlbumSyncEvent;
import com.weseethemusic.music.common.entity.Album;
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
public class AlbumEntityListener {

    private static MusicEventPublisher eventPublisher;
    private static SyncSagaService syncSagaService;

    public AlbumEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        AlbumEntityListener.eventPublisher = eventPublisher;
        AlbumEntityListener.syncSagaService = syncSagaService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPostPersist(Album album) {
        SyncSagaForRecommendation saga = syncSagaService.startAlbumSync(album.getId(),
            OperationType.CREATE);
        eventPublisher.publishAlbumEvent(new AlbumSyncEvent(
            AlbumSyncEvent.EventType.STARTED,
            AlbumDto.fromEntity(album),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostUpdate
    public void onPostUpdate(Album album) {
        SyncSagaForRecommendation saga = syncSagaService.startAlbumSync(album.getId(),
            OperationType.UPDATE);
        eventPublisher.publishAlbumEvent(new AlbumSyncEvent(
            AlbumSyncEvent.EventType.STARTED,
            AlbumDto.fromEntity(album),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostRemove
    public void onPostRemove(Album album) {
        SyncSagaForRecommendation saga = syncSagaService.startAlbumSync(album.getId(),
            OperationType.DELETE);
        eventPublisher.publishAlbumEvent(new AlbumSyncEvent(
            AlbumSyncEvent.EventType.STARTED,
            AlbumDto.fromEntity(album),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }
}