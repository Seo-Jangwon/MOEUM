package com.weseethemusic.music.common.consumer;

import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.music.common.service.SyncSagaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MusicGenreSyncResultConsumer {

    private final SyncSagaService sagaService;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.genre-sync-result}")
    public void handleGenreSyncResult(GenreSyncEvent event) {
        log.info("장르 동기화 결과 수신: {}, sagaId: {}", event.getEventType(), event.getSagaId());

        switch (event.getEventType()) {
            case COMPLETED -> sagaService.completeSaga(event.getSagaId());
            case FAILED -> {
                String errorMessage = String.format("장르 동기화 실패 - genreId: %d",
                    event.getGenre().getId());
                sagaService.handleError(event.getSagaId(), errorMessage);
            }
        }
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.music-sync-result}")
    public void handleMusicSyncResult(MusicSyncEvent event) {
        log.info("음악 동기화 결과 수신: {}, sagaId: {}", event.getEventType(), event.getSagaId());

        switch (event.getEventType()) {
            case COMPLETED -> sagaService.completeSaga(event.getSagaId());
            case FAILED_GENRE_NOT_FOUND -> sagaService.handleGenreNotFound(
                event.getSagaId(),
                event.getMusic().getGenreId(),
                event.getErrMessage()
            );
            case FAILED_ALBUM_NOT_FOUND -> sagaService.handleAlbumNotFound(
                event.getSagaId(),
                event.getMusic().getAlbumId(),
                event.getErrMessage()
            );
            case FAILED_ARTIST_NOT_FOUND -> sagaService.handleArtistNotFound(
                event.getSagaId(),
                event.getMusic().getArtistIds(),
                event.getErrMessage()
            );
            case FAILED -> sagaService.handleError(
                event.getSagaId(),
                String.format("음악 동기화 중 알 수 없는 에러 발생 - musicId: %d, error: %s",
                    event.getMusic().getId(),
                    event.getErrMessage())
            );
        }
    }
}