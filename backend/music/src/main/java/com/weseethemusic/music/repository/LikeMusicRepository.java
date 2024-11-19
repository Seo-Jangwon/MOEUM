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

    @Query("select lm.music from LikeMusic lm group by lm.music having lm.music.genre.id = :genreId order by count(*) desc limit 10")
    List<Music> getPopularMusicsByGenre(int genreId);

    void deleteLikeMusicByMemberIdAndMusic_Id(Long memberId, Long musicId);

    @Query("select lm.music from LikeMusic lm where lm.memberId = :memberId")
    List<Music> getMyLikeMusics(Long memberId);

    boolean existsByMemberIdAndMusic_Id(Long memberId, Long musicId);

}
