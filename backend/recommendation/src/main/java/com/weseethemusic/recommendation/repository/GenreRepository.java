package com.weseethemusic.recommendation.repository;

import com.weseethemusic.recommendation.common.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Integer> {

}
