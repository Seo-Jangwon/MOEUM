package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.Artist;
import com.weseethemusic.recommendation.common.entity.ArtistMusic;
import com.weseethemusic.recommendation.common.entity.ArtistMusicId;
import com.weseethemusic.recommendation.common.entity.Music;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistMusicRepository extends JpaRepository<ArtistMusic, ArtistMusicId> {

    @Query("select a.artist from ArtistMusic a where a.music = :music")
    List<Artist> findAllByMusic(Music music);

}
