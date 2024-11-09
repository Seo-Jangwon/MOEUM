package com.weseethemusic.music.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "sync_saga")
@Slf4j
public class SyncSagaForRecommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sagaId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SagaType type;

    @Column(nullable = false)
    private Long targetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SagaState state;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OperationType operation;  // CREATE, UPDATE, DELETE

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime completedAt;

    @Column(length = 500)
    private String errorMessage;

    public enum SagaType {
        GENRE_SYNC, MUSIC_SYNC
    }

    public enum SagaState {
        STARTED,     // 동기화 시작
        SENT,        // 이벤트 발송
        COMPLETED,   // 동기화 완료
        FAILED       // 실패
    }

    public enum OperationType {
        CREATE, UPDATE, DELETE
    }

    // Genre Sync Saga 시작
    public static SyncSagaForRecommendation startGenreSync(Long genreId, OperationType operation) {
        SyncSagaForRecommendation saga = new SyncSagaForRecommendation();
        saga.setType(SagaType.GENRE_SYNC);
        saga.setTargetId(genreId);
        saga.setState(SagaState.STARTED);
        saga.setOperation(operation);
        saga.setCreatedAt(LocalDateTime.now());
        return saga;
    }

    // Music Sync Saga 시작
    public static SyncSagaForRecommendation startMusicSync(Long musicId, OperationType operation) {
        SyncSagaForRecommendation saga = new SyncSagaForRecommendation();
        saga.setType(SagaType.MUSIC_SYNC);
        saga.setTargetId(musicId);
        saga.setState(SagaState.STARTED);
        saga.setOperation(operation);
        saga.setCreatedAt(LocalDateTime.now());
        return saga;
    }

    public void markSent() {
        log.info("Saga {} 상태 변경: {} -> {}", sagaId, state, SagaState.SENT);
        this.state = SagaState.SENT;
    }

    public void complete() {
        log.info("Saga {} 상태 변경: {} -> {}", sagaId, state, SagaState.COMPLETED);
        this.state = SagaState.COMPLETED;
        this.completedAt = LocalDateTime.now();
    }

    public void fail(String errorMessage) {
        log.info("Saga {} 실패: {}", sagaId, errorMessage);
        this.state = SagaState.FAILED;
        this.errorMessage = errorMessage;
        this.completedAt = LocalDateTime.now();
    }
}