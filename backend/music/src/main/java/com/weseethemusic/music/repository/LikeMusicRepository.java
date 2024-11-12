package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.LikeMusic;
import com.weseethemusic.music.common.entity.LikeMusicId;
import com.weseethemusic.music.common.entity.Music;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeMusicRepository extends JpaRepository<LikeMusic, LikeMusicId> {

    @Query("select l.music from LikeMusic l group by l.music order by count(*) desc limit 30")
    List<Music> getPopularMusics();

}
