package com.weseethemusic.music.common.publisher;

import com.weseethemusic.common.event.AlbumSyncEvent;
import com.weseethemusic.common.event.ArtistSyncEvent;
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

    @Value("${rabbitmq.routing.album-sync}")
    private String albumSyncRoutingKey;

    @Value("${rabbitmq.routing.artist-sync}")
    private String artistSyncRoutingKey;

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

    public void publishAlbumEvent(AlbumSyncEvent event) {
        try {
            rabbitTemplate.convertAndSend(exchangeName, albumSyncRoutingKey, event);
            log.info("앨범 동기화 이벤트 퍼블리시: {}", event);
        } catch (Exception e) {
            log.error("앨범 동기화 이벤트 퍼블리시 실패", e);
        }
    }

    public void publishArtistEvent(ArtistSyncEvent event) {
        try {
            rabbitTemplate.convertAndSend(exchangeName, artistSyncRoutingKey, event);
            log.info("아티스트 동기화 이벤트 퍼블리시: {}", event);
        } catch (Exception e) {
            log.error("아티스트 동기화 이벤트 퍼블리시 실패", e);
        }
    }
}