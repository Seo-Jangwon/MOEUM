package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.Music;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MusicRepository extends JpaRepository<Music, Long> {

}
