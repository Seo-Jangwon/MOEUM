package com.weseethemusic.recommendation.common.service;

import com.weseethemusic.common.event.AlbumSyncEvent;
import com.weseethemusic.common.event.ArtistSyncEvent;
import com.weseethemusic.common.event.ArtistSyncEvent.EventType;
import com.weseethemusic.recommendation.service.artist.ArtistService;
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
public class ArtistSyncConsumer {

    private final ArtistService artistService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.artist-sync-result}")
    private String artistSyncResultRoutingKey;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.artist-sync}")
    public void handleArtistSync(ArtistSyncEvent event) {
        log.info("아티스트 동기화 이벤트 수신: {}, sagaId: {}", event, event.getSagaId());

        try {

            // 앨범 존재여부 확인
            if (artistService.existsById(event.getArtist().getId())) {
                throw new RuntimeException(
                    String.format("아티스트 존재. artistId: %d, sagaId: %s",
                        event.getArtist().getId(),
                        event.getSagaId())
                );
            }

            artistService.createArtist(event.getArtist());

            // 성공 이벤트 발행
            ArtistSyncEvent resultEvent = new ArtistSyncEvent(
                EventType.COMPLETED,
                event.getArtist(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, artistSyncResultRoutingKey, resultEvent);

        } catch (RuntimeException e) {
            log.error("아티스트 이미 존재. 아티스트 동기화 불필요: {}", e.getMessage());

            // 성공 이벤트 발행
            ArtistSyncEvent resultEvent = new ArtistSyncEvent(
                ArtistSyncEvent.EventType.COMPLETED,
                event.getArtist(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, artistSyncResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("아티스트 동기화 실패: {}", event, e);

            // 실패 이벤트 발행
            ArtistSyncEvent resultEvent = new ArtistSyncEvent(
                EventType.FAILED,
                event.getArtist(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, artistSyncResultRoutingKey, resultEvent);
        }
    }
}