package com.weseethemusic.member.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "delete_member_saga")
public class DeleteMemberSaga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long memberId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SagaState state;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime completedAt;

    @Column(length = 500)
    private String errorMessage;

    public enum SagaState {
        STARTED,               // 삭제 프로세스 시작
        PLAYLIST_DELETE_SENT,  // 플레이리스트 삭제 요청 발송
        PLAYLIST_DELETED,      // 플레이리스트 삭제 완료
        COMPLETED,            // 모든 프로세스 완료
        FAILED                // 실패
    }

    public static DeleteMemberSaga start(Long memberId) {
        DeleteMemberSaga saga = new DeleteMemberSaga();
        saga.setMemberId(memberId);
        saga.setState(SagaState.STARTED);
        saga.setCreatedAt(LocalDateTime.now());
        return saga;
    }

    public void markPlaylistDeleteSent() {
        log.info("Saga {} 의 상태가 변함: {} -> {}", id, state, SagaState.PLAYLIST_DELETE_SENT);
        this.state = SagaState.PLAYLIST_DELETE_SENT;
    }

    public void markPlaylistDeleted() {
        this.state = SagaState.PLAYLIST_DELETED;
    }

    public void complete() {
        log.info("Saga {} 의 상태가 변함: {} -> {}", id, state, SagaState.COMPLETED);
        this.state = SagaState.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void fail(String errorMessage) {
        this.state = SagaState.FAILED;
        this.errorMessage = errorMessage;
        this.completedAt = LocalDateTime.now();
    }
}