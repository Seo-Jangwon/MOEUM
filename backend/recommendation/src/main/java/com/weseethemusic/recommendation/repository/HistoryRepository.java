package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.History;
import com.weseethemusic.recommendation.common.entity.HistoryId;
import com.weseethemusic.recommendation.common.entity.Music;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoryRepository extends JpaRepository<History, HistoryId> {

    @Query("select h.music from History h where h.memberId = :memberId")
    List<Music> findAllByMemberId(Long memberId);

    void deleteByMemberIdAndMusic_Id(Long memberId, Long musicId);

    @Query("SELECT h FROM History h JOIN FETCH h.music m " +
        "LEFT JOIN FETCH m.artistMusics am " +
        "LEFT JOIN FETCH am.artist " +
        "LEFT JOIN FETCH m.genre " +
        "WHERE h.memberId = :memberId")
    List<History> findByMemberId(@Param("memberId") long memberId);
}
