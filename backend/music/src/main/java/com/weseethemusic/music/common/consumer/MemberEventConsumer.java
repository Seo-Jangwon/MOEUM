package com.weseethemusic.music.common.consumer;

import com.weseethemusic.common.event.DeleteMemberEvent;
import com.weseethemusic.music.service.PlaylistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberEventConsumer {

    private final PlaylistService playlistService;
    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.member-delete-result}")
    private String memberDeleteResultRoutingKey;

    /**
     * 회원 삭제 이벤트 처리
     * @param event 수신된 삭제 이벤트
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    @RabbitListener(queues = "${rabbitmq.queue.member-delete}")
    public void handleDeleteMemberEvent(DeleteMemberEvent event) {
        log.info("memberId: {}에 대한 플레이리스트 삭제 요청 수신, sagaId: {}",
            event.getMemberId(), event.getSagaId());

        try {
            // 해당 회원의 모든 플레이리스트 삭제
            playlistService.deleteAllPlaylistsByMemberId(event.getMemberId());

            // 성공 이벤트 발행
            DeleteMemberEvent resultEvent = new DeleteMemberEvent(
                event.getMemberId(),
                DeleteMemberEvent.EventType.PLAYLIST_DELETE_COMPLETED.name(),
                event.getSagaId()
            );

            rabbitTemplate.convertAndSend(exchangeName, memberDeleteResultRoutingKey, resultEvent);

        } catch (Exception e) {
            log.error("member: {}에 대한 플레이리스트 삭제 실패", event.getMemberId(), e);

            // 실패 이벤트 발행
            DeleteMemberEvent resultEvent = new DeleteMemberEvent(
                event.getMemberId(),
                DeleteMemberEvent.EventType.PLAYLIST_DELETE_FAILED.name(),
                event.getSagaId()
            );

            rabbitTemplate.convertAndSend(exchangeName, memberDeleteResultRoutingKey, resultEvent);
        }
    }
}