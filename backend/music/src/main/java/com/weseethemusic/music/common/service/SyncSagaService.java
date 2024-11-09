package com.weseethemusic.music.common.service;


import com.weseethemusic.music.common.entity.SyncSagaForRecommendation;
import com.weseethemusic.music.repository.SyncSagaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class SyncSagaService {

    private final SyncSagaRepository sagaRepository;

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SyncSagaForRecommendation startGenreSync(int genreId,
        SyncSagaForRecommendation.OperationType operation) {
        SyncSagaForRecommendation saga = SyncSagaForRecommendation.startGenreSync(
            Integer.toUnsignedLong(genreId), operation);
        return sagaRepository.save(saga);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public SyncSagaForRecommendation startMusicSync(Long musicId,
        SyncSagaForRecommendation.OperationType operation) {
        SyncSagaForRecommendation saga = SyncSagaForRecommendation.startMusicSync(musicId,
            operation);
        return sagaRepository.save(saga);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void setSagaSent(String sagaId) {
        sagaRepository.findBySagaId(sagaId)
            .ifPresentOrElse(
                saga -> {
                    saga.markSent();
                    sagaRepository.save(saga);
                },
                () -> {
                    log.error("전송 처리할 saga를 찾을 수 없음: {}", sagaId);
                    throw new RuntimeException("전송 처리할 saga를 찾을 수 없음: " + sagaId);
                }
            );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void completeSaga(String sagaId) {
        sagaRepository.findBySagaId(sagaId)
            .ifPresentOrElse(
                saga -> {
                    saga.complete();
                    sagaRepository.save(saga);
                },
                () -> {
                    log.error("완료처리할 saga를 찾을 수 없음: {}", sagaId);
                    throw new RuntimeException("완료처리할 saga를 찾을 수 없음: " + sagaId);
                }
            );
    }

    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void failSaga(String sagaId, String errorMessage) {
        sagaRepository.findBySagaId(sagaId)
            .ifPresentOrElse(
                saga -> {
                    saga.fail(errorMessage);
                    sagaRepository.save(saga);
                    // todo: 실패 처리 로직 추가
                },
                () -> {
                    log.error("실패 처리할 saga를 찾을 수 없음: {}", sagaId);
                    throw new RuntimeException("실패 처리할 saga를 찾을 수 없음: " + sagaId);
                }
            );
    }

}