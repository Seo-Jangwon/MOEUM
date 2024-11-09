package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.SyncSagaForRecommendation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SyncSagaRepository extends JpaRepository<SyncSagaForRecommendation, Long> {

    Optional<SyncSagaForRecommendation> findBySagaId(String sagaId);

    Optional<Object> findFirstByTargetIdOrderByCreatedAtDesc(Long targetId);
}
