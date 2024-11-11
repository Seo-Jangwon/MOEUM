package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Playlist;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {

    List<Playlist> findByMemberId(Long memberId);

    @Query("select p from Playlist p where p.name like concat('%', :keyword, '%') ")
    List<Playlist> findAllByName(String keyword, Pageable pageable);

}
