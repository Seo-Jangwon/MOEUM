package com.weseethemusic.member.common.service;

import com.weseethemusic.common.event.DeleteMemberEvent;
import com.weseethemusic.member.service.delete.DeleteServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberEventConsumer {

    private final DeleteServiceImpl deleteService;

    /**
     * 플레이리스트 삭제 결과 처리
     *
     * @param event 결과 이벤트
     */
    @RabbitListener(queues = "${rabbitmq.queue.member-delete-result}")
    public void handlePlaylistDeleteResult(DeleteMemberEvent event) {
        log.info("플레이리스트 삭제 결과 수신. memberId: {}, sagaId: {}, result: {}",
            event.getMemberId(), event.getSagaId(), event.getEventType());

        if (event.getEventType()
            .equals(DeleteMemberEvent.EventType.PLAYLIST_DELETE_COMPLETED.name())) {
            // 플레이리스트 삭제 성공 시 회원 정보 삭제
            deleteService.completeDeleteMember(
                Long.parseLong(event.getSagaId()),
                event.getMemberId()
            );
        } else if (event.getEventType()
            .equals(DeleteMemberEvent.EventType.PLAYLIST_DELETE_FAILED.name())) {
            // 플레이리스트 삭제 실패 처리
            log.error("멤버: {}에 대한 플레이리스트 삭제 실패", event.getMemberId());
            deleteService.handleDeleteMemberFailed(
                Long.parseLong(event.getSagaId()),
                event.getMemberId()
            );
        }
    }
}