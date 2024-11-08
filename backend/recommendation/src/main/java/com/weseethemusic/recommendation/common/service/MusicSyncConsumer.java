package com.weseethemusic.recommendation.common.service;

import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent.EventType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicSyncConsumer {

    private final RecommendMusicService recommendMusicService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.music-sync-result}")
    private String musicSyncResultRoutingKey;

    @RabbitListener(queues = "${rabbitmq.queue.music-sync}")
    public void handleMusicSync(MusicSyncEvent event) {
        log.info("Received music sync event: {}, sagaId: {}", event, event.getSagaId());

        try {
            recommendMusicService.createMusic(event.getMusic());

            // 성공 이벤트 발행
            MusicSyncEvent resultEvent = new MusicSyncEvent(
                EventType.COMPLETED,
                event.getMusic(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("Failed to process music sync: {}", event, e);

            // 실패 이벤트 발행
            MusicSyncEvent resultEvent = new MusicSyncEvent(
                EventType.FAILED,
                event.getMusic(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, musicSyncResultRoutingKey, resultEvent);
        }
    }
}
