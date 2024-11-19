package com.weseethemusic.recommendation.common.service.consumer;

import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent.EventType;
import com.weseethemusic.recommendation.service.album.AlbumService;
import com.weseethemusic.recommendation.service.artist.ArtistService;
import com.weseethemusic.recommendation.service.genre.GenreService;
import com.weseethemusic.recommendation.service.music.MusicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicSyncConsumer {

    private final MusicService musicService;
    private final GenreService genreService;
    private final AlbumService albumService;
    private final ArtistService artistService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.music-sync-result}")
    private String musicSyncResultRoutingKey;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.music-sync}")
    public void handleMusicSync(MusicSyncEvent event) {
        log.info("음악 동기화 이벤트 수신: {}, sagaId: {}", event, event.getSagaId());

        try {
            // 음악 존재여부 확인
            if (musicService.existsById(event.getMusic().getId())) {
                throw new RuntimeException(
                    String.format("음악 존재. albumId: %d, sagaId: %s",
                        event.getMusic().getId(),
                        event.getSagaId())
                );
            }

            // 장르 존재 여부 확인
            if (!genreService.existsById(event.getMusic().getGenreId())) {
                sendFailureEvent(
                    event,
                    EventType.FAILED_GENRE_NOT_FOUND,
                    String.format("장르를 찾을 수 없음. genreId: %d", event.getMusic().getGenreId())
                );
                return;
            }

            // 앨범 존재 여부 확인
            if (!albumService.existsById(event.getMusic().getAlbumId())) {
                sendFailureEvent(
                    event,
                    EventType.FAILED_ALBUM_NOT_FOUND,
                    String.format("앨범을 찾을 수 없음. albumId: %d", event.getMusic().getAlbumId())
                );
                return;
            }

            // 아티스트 존재 여부 확인
            for (Long artistId : event.getMusic().getArtistIds()) {
                if (!artistService.existsById(artistId)) {
                    sendFailureEvent(
                        event,
                        EventType.FAILED_ARTIST_NOT_FOUND,
                        String.format("아티스트를 찾을 수 없음. artistId: %d", artistId)
                    );
                    return;
                }
            }

            musicService.createMusic(event.getMusic());

            // 성공 이벤트
            sendSuccessEvent(event);

        } catch (RuntimeException e) {
            log.info("앨범 이미 존재. 앨범 동기화 불필요: {}", e.getMessage());

            sendSuccessEvent(event);

        } catch (Exception e) {
            log.error("음악 동기화 실패: {}", event, e);
            sendFailureEvent(
                event,
                EventType.FAILED,
                String.format("음악 동기화 에러 발생: %s", e.getMessage())
            );
        }

    }

    private void sendFailureEvent(MusicSyncEvent originalEvent, EventType failureType,
        String errorMessage) {
        MusicSyncEvent resultEvent = new MusicSyncEvent(
            failureType,
            originalEvent.getMusic(),
            originalEvent.getSagaId(),
            errorMessage
        );
        rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);
        log.error("음악 동기화 실패: {}", errorMessage);
    }

    private void sendSuccessEvent(MusicSyncEvent originalEvent) {
        MusicSyncEvent resultEvent = new MusicSyncEvent(
            EventType.COMPLETED,
            originalEvent.getMusic(),
            originalEvent.getSagaId(),
            null
        );
        rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);
        log.info("음악 동기화 성공: musicId={}", originalEvent.getMusic().getId());
    }
}