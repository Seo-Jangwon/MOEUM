package com.weseethemusic.recommendation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.common.dto.GenreDto;
import com.weseethemusic.recommendation.common.entity.Genre;
import com.weseethemusic.recommendation.repository.GenreRepository;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GenreServiceTest {

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private GenreServiceImpl genreService;

    @Captor
    private ArgumentCaptor<Genre> genreCaptor;

    private GenreDto genreDto;

    @BeforeEach
    void setUp() {
        genreDto = GenreDto.builder()
            .id(1)
            .name("K-POP")
            .build();
    }

    @Test
    @DisplayName("장르가 존재하지 않을 때 새로운 장르 생성")
    void createGenre_WhenGenreNotExists_ThenSaveNewGenre() {
        // given
        when(genreRepository.findById(genreDto.getId())).thenReturn(Optional.empty());

        // when
        genreService.createGenre(genreDto);

        // then
        verify(genreRepository, times(1)).save(genreCaptor.capture());
        Genre savedGenre = genreCaptor.getValue();
        assertThat(savedGenre.getId()).isEqualTo(genreDto.getId());
        assertThat(savedGenre.getName()).isEqualTo(genreDto.getName());
    }

    @Test
    @DisplayName("장르가 존재할 때 저장을 수행하지 않음")
    void createGenre_WhenGenreExists_ThenDoNotSave() {
        // given
        Genre existingGenre = new Genre();
        existingGenre.setId(genreDto.getId());
        existingGenre.setName(genreDto.getName());

        when(genreRepository.findById(genreDto.getId())).thenReturn(Optional.of(existingGenre));

        // when
        genreService.createGenre(genreDto);

        // then
        verify(genreRepository, never()).save(any());
    }
}