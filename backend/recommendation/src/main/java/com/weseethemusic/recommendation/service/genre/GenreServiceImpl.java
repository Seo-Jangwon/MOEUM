package com.weseethemusic.recommendation.service.genre;

import com.weseethemusic.common.dto.GenreDto;
import com.weseethemusic.recommendation.common.entity.Genre;
import com.weseethemusic.recommendation.repository.GenreRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GenreServiceImpl implements GenreService {

    private final GenreRepository genreRepository;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createGenre(GenreDto genreDto) {
        // 장르 ID로 먼저 조회
        if (genreRepository.findById(genreDto.getId()).isPresent()) {
            log.info("장르가 이미 존재함. 장르 id: {}", genreDto.getId());
            return;
        }

        // 새로운 장르 엔티티 생성 및 저장
        Genre genre = new Genre();
        genre.setId(genreDto.getId());
        genre.setName(genreDto.getName());

        genreRepository.save(genre);
        log.info("장르가 성공적으로 생성됨. id: {}", genre.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(int genreId) {
        return genreRepository.findById(genreId).isPresent();
    }
}
