package com.weseethemusic.recommendation.common.service;

import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent.EventType;
import com.weseethemusic.recommendation.service.GenreService;
import com.weseethemusic.recommendation.service.MusicService;
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
    private final GenreService genreService; // 추가
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
            // 장르 존재 여부 확인
            if (!genreService.existsById(event.getMusic().getGenreId())) {
                throw new RuntimeException(
                    String.format("장르 찾을 수 없음. genreId: %d, musicId: %d, sagaId: %s",
                        event.getMusic().getGenreId(),
                        event.getMusic().getId(),
                        event.getSagaId())
                );
            }

            musicService.createMusic(event.getMusic());

            // 성공 이벤트 발행
            MusicSyncEvent resultEvent = new MusicSyncEvent(
                EventType.COMPLETED,
                event.getMusic(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);

        } catch (RuntimeException e) {
            log.error("장르가 존재하지 않아 음악 동기화 실패: {}", e.getMessage());

            // 실패 이벤트 발행 (장르 없음)
            MusicSyncEvent resultEvent = new MusicSyncEvent(
                EventType.FAILED,
                event.getMusic(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("음악 동기화 실패: {}", event, e);

            // 기타 오류 실패 이벤트 발행
            MusicSyncEvent resultEvent = new MusicSyncEvent(
                EventType.FAILED,
                event.getMusic(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);
        }
    }

}