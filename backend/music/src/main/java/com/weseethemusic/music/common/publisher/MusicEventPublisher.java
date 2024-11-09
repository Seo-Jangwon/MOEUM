package com.weseethemusic.music.common.publisher;

import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.music-sync}")
    private String musicSyncRoutingKey;

    @Value("${rabbitmq.routing.genre-sync}")
    private String genreSyncRoutingKey;

    public void publishMusicEvent(MusicSyncEvent event) {
        try {
            rabbitTemplate.convertAndSend(exchangeName, musicSyncRoutingKey, event);
            log.info("음악 동기화 이벤트 퍼블리시: {}", event);
        } catch (Exception e) {
            log.error("음악 동기화 이벤트 퍼블리시 실패", e);
        }
    }

    public void publishGenreEvent(GenreSyncEvent event) {
        try {
            rabbitTemplate.convertAndSend(exchangeName, genreSyncRoutingKey, event);
            log.info("장르 동기화 이벤트 퍼블리시: {}", event);
        } catch (Exception e) {
            log.error("장르 동기화 이벤트 퍼블리시 실패", e);
        }
    }
}