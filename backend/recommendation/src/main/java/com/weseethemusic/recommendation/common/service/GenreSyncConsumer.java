package com.weseethemusic.recommendation.common.service;

import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.common.event.GenreSyncEvent.EventType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class GenreSyncConsumer {
    private final RecommendGenreService recommendGenreService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.genre-sync-result}")
    private String genreSyncResultRoutingKey;

    @RabbitListener(queues = "${rabbitmq.queue.genre-sync}")
    public void handleGenreSync(GenreSyncEvent event) {
        log.info("Received genre sync event: {}, sagaId: {}", event, event.getSagaId());

        try {
            recommendGenreService.createGenre(event.getGenre());

            // 성공 이벤트 발행
            GenreSyncEvent resultEvent = new GenreSyncEvent(
                EventType.COMPLETED,
                event.getGenre(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, genreSyncResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("Failed to process genre sync: {}", event, e);

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