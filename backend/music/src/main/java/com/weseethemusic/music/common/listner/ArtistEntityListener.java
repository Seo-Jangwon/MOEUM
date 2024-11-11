package com.weseethemusic.music.common.listner;

import com.weseethemusic.common.dto.ArtistDto;
import com.weseethemusic.common.event.ArtistSyncEvent;
import com.weseethemusic.music.common.entity.Artist;
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
public class ArtistEntityListener {

    private static MusicEventPublisher eventPublisher;
    private static SyncSagaService syncSagaService;

    public ArtistEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        ArtistEntityListener.eventPublisher = eventPublisher;
        ArtistEntityListener.syncSagaService = syncSagaService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPostPersist(Artist artist) {
        SyncSagaForRecommendation saga = syncSagaService.startArtistSync(artist.getId(),
            OperationType.CREATE);
        eventPublisher.publishArtistEvent(new ArtistSyncEvent(
            ArtistSyncEvent.EventType.STARTED,
            ArtistDto.fromEntity(artist),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostUpdate
    public void onPostUpdate(Artist artist) {
        SyncSagaForRecommendation saga = syncSagaService.startArtistSync(artist.getId(),
            OperationType.UPDATE);
        eventPublisher.publishArtistEvent(new ArtistSyncEvent(
            ArtistSyncEvent.EventType.STARTED,
            ArtistDto.fromEntity(artist),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }

    @PostRemove
    public void onPostRemove(Artist artist) {
        SyncSagaForRecommendation saga = syncSagaService.startArtistSync(artist.getId(),
            OperationType.DELETE);
        eventPublisher.publishArtistEvent(new ArtistSyncEvent(
            ArtistSyncEvent.EventType.STARTED,
            ArtistDto.fromEntity(artist),
            saga.getSagaId()
        ));
        syncSagaService.setSagaSent(saga.getSagaId());
    }
}
