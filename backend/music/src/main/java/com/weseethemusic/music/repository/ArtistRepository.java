package com.weseethemusic.music.repository;

import com.weseethemusic.music.common.entity.Artist;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {

    @Query("select a from Artist a where a.name like concat('%', :keyword, '%') ")
    List<Artist> findAllByName(String keyword, Pageable pageable);

}
