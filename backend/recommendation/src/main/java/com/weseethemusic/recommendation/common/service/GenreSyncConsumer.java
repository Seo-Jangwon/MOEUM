package com.weseethemusic.recommendation.common.service;

import com.weseethemusic.common.event.ArtistSyncEvent;
import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.common.event.GenreSyncEvent.EventType;
import com.weseethemusic.recommendation.service.genre.GenreService;
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
public class GenreSyncConsumer {

    private final GenreService genreService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.genre-sync-result}")
    private String genreSyncResultRoutingKey;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.genre-sync}")
    public void handleGenreSync(GenreSyncEvent event) {
        log.info("장르 동기화 이벤트 수신: {}, sagaId: {}", event, event.getSagaId());

        try {

            // 장르 존재여부 확인
            if (genreService.existsById(event.getGenre().getId())) {
                throw new RuntimeException(
                    String.format("장르 존재. 장르Id: %d, sagaId: %s",
                        event.getGenre().getId(),
                        event.getSagaId())
                );
            }

            genreService.createGenre(event.getGenre());

            // 성공 이벤트 발행
            GenreSyncEvent resultEvent = new GenreSyncEvent(
                EventType.COMPLETED,
                event.getGenre(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, genreSyncResultRoutingKey, resultEvent);

        } catch (RuntimeException e) {
            log.error("아티스트 이미 존재. 아티스트 동기화 불필요: {}", e.getMessage());

            // 성공 이벤트 발행
            GenreSyncEvent resultEvent = new GenreSyncEvent(
                GenreSyncEvent.EventType.COMPLETED,
                event.getGenre(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, genreSyncResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("장르 동기화 실패: {}", event, e);

            // 실패 이벤트 발행
            GenreSyncEvent resultEvent = new GenreSyncEvent(
                EventType.FAILED,
                event.getGenre(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, genreSyncResultRoutingKey, resultEvent);
        }
    }
}