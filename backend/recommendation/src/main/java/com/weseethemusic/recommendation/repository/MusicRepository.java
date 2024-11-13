package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.Music;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MusicRepository extends JpaRepository<Music, Long> {

    @Query("SELECT DISTINCT m FROM Music m " +
        "LEFT JOIN FETCH m.album " +
        "LEFT JOIN FETCH m.genre " +
        "LEFT JOIN FETCH m.artistMusics am " +
        "LEFT JOIN FETCH am.artist")
    List<Music> findAllWithDetails();
}
