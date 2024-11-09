package com.weseethemusic.member.common.service;

import com.weseethemusic.common.event.DeleteMemberEvent;
import com.weseethemusic.member.common.entity.DeleteMemberSaga;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MemberEventProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name}")
    private String exchangeName;

    @Value("${rabbitmq.routing.member-delete}")
    private String memberDeleteRoutingKey;

    /**
     * 회원 삭제 시작 이벤트를 발행합니다.
     *
     * @param saga 현재 진행 중인 삭제 SAGA
     */
    public void publishDeleteMemberStartedEvent(DeleteMemberSaga saga) {
        DeleteMemberEvent event = new DeleteMemberEvent(
            saga.getMemberId(),
            DeleteMemberEvent.EventType.DELETE_MEMBER_STARTED.name(),
            saga.getId().toString()
        );

        log.info("회원 삭제 이벤트 발행 sagaId: {}, memberId: {}",
            saga.getId(), saga.getMemberId());

        rabbitTemplate.convertAndSend(exchangeName, memberDeleteRoutingKey, event);
    }
}