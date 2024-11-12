package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.History;
import com.weseethemusic.recommendation.common.entity.HistoryId;
import com.weseethemusic.recommendation.common.entity.Music;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryRepository extends JpaRepository<History, HistoryId> {

    @Query("select h.music from History h where h.memberId = :memberId")
    List<Music> findAllByMemberId(Long memberId);

    void deleteByMemberIdAndMusic_Id(Long memberId, Long musicId);
    
}
