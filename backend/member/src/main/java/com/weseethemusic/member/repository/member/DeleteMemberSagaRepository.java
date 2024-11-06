package com.weseethemusic.member.repository.member;

import com.weseethemusic.member.common.entity.DeleteMemberSaga;
import com.weseethemusic.member.common.entity.DeleteMemberSaga.SagaState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeleteMemberSagaRepository extends JpaRepository<DeleteMemberSaga, Long> {
    // 특정 member의 특정 상태의 saga 조회
    Optional<DeleteMemberSaga> findByMemberIdAndState(Long memberId, SagaState state);

    // 특정 시간 이전에 생성된 특정 상태의 saga들 조회 (타임아웃 처리)
    List<DeleteMemberSaga> findByStateAndCreatedAtBefore(SagaState state, LocalDateTime dateTime);

    // 특정 회원의 가장 최근 SAGA 조회
    Optional<DeleteMemberSaga> findFirstByMemberIdOrderByCreatedAtDesc(Long memberId);
}
