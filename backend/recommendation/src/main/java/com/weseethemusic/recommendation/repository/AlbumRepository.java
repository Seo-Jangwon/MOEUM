package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    @Query("select a.imageName from Album a where a.id = :albumId")
    String getAlbumImage(Long albumId);

}
