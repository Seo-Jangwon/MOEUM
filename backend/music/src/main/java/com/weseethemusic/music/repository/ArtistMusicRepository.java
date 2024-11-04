package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.ArtistMusic;
import com.weseethemusic.music.common.entity.ArtistMusicId;
import com.weseethemusic.music.common.entity.Music;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistMusicRepository extends JpaRepository<ArtistMusic, ArtistMusicId> {

    @Query("select a.artist from ArtistMusic a where a.music = :music")
    List<Artist> findAllByMusic(Music music);

}
