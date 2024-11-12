package com.weseethemusic.recommendation.common.service.consumer;


import com.weseethemusic.common.event.AlbumSyncEvent;
import com.weseethemusic.common.event.AlbumSyncEvent.EventType;
import com.weseethemusic.recommendation.service.album.AlbumService;
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
public class AlbumSyncConsumer {

    private final AlbumService albumService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.album-sync-result}")
    private String albumSyncResultRoutingKey;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.album-sync}")
    public void handleAlbumSync(AlbumSyncEvent event) throws RuntimeException {
        log.info("앨범 동기화 이벤트 수신: {}, sagaId: {}", event, event.getSagaId());

        try {
            // 앨범 존재여부 확인
            if (albumService.existsById(event.getAlbum().getId())) {
                throw new RuntimeException(
                    String.format("앨범 존재. albumId: %d, sagaId: %s",
                        event.getAlbum().getId(),
                        event.getSagaId())
                );
            }

            albumService.createAlbum(event.getAlbum());

            // 성공 이벤트 발행
            AlbumSyncEvent resultEvent = new AlbumSyncEvent(
                EventType.COMPLETED,
                event.getAlbum(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, albumSyncResultRoutingKey, resultEvent);

        } catch (RuntimeException e) {
            log.info("앨범 이미 존재. 앨범 동기화 불필요: {}", e.getMessage());

            // 성공 이벤트 발행
            AlbumSyncEvent resultEvent = new AlbumSyncEvent(
                EventType.COMPLETED,
                event.getAlbum(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, albumSyncResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("앨범 동기화 실패: {}", event, e);

            // 기타 오류 실패 이벤트 발행
            AlbumSyncEvent resultEvent = new AlbumSyncEvent(
                EventType.FAILED,
                event.getAlbum(),
                event.getSagaId()
            );
            rabbitTemplate.convertAndSend(exchangeName, albumSyncResultRoutingKey, resultEvent);
        }
    }
}