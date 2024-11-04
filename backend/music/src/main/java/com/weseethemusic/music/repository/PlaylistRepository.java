package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Playlist;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    @Query("SELECT DISTINCT p FROM Playlist p " +
        "LEFT JOIN FETCH p.playlistMusics pm " +
        "LEFT JOIN FETCH pm.music m " +
        "LEFT JOIN FETCH m.album " +
        "WHERE p.memberId = :memberId")
    List<Playlist> findByMemberId(Long memberId);
}
