package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.LikeMusic;
import com.weseethemusic.music.common.entity.LikeMusicId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeMusicRepository extends JpaRepository<LikeMusic, LikeMusicId> {

}
