package com.weseethemusic.recommendation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.recommendation.common.entity.Genre;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.repository.GenreRepository;
import com.weseethemusic.recommendation.repository.MusicRepository;
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
class MusicServiceTest {

    @Mock
    private MusicRepository musicRepository;

    @Mock
    private GenreRepository genreRepository;

    @InjectMocks
    private MusicServiceImpl musicService;

    @Captor
    private ArgumentCaptor<Music> musicCaptor;

    private MusicDto musicDto;
    private Genre genre;

    @BeforeEach
    void setUp() {
        genre = new Genre();
        genre.setId(1);
        genre.setName("K-POP");

        musicDto = MusicDto.builder()
            .id(1L)
            .name("Test Music")
            .genreId(1)
            .duration(180)
            .danceability(0.8)
            .loudness(-4.2)
            .mode(true)
            .speechiness(0.3)
            .acousticness(0.4)
            .valence(0.6)
            .tempo(120.0)
            .energy(0.7)
            .build();
    }

    @Test
    @DisplayName("음악, 장르가 존재하지 않을 때 새로운 음악을 생성")
    void createMusic_WhenMusicAndGenreExist_ThenSaveNewMusic() {
        // given
        when(musicRepository.findById(musicDto.getId())).thenReturn(Optional.empty());
        when(genreRepository.findById(musicDto.getGenreId())).thenReturn(Optional.of(genre));

        // when
        musicService.createMusic(musicDto);

        // then
        verify(musicRepository, times(1)).save(musicCaptor.capture());
        Music savedMusic = musicCaptor.getValue();
        assertThat(savedMusic.getId()).isEqualTo(musicDto.getId());
        assertThat(savedMusic.getName()).isEqualTo(musicDto.getName());
        assertThat(savedMusic.getGenre()).isEqualTo(genre);
        assertThat(savedMusic.getDuration()).isEqualTo(musicDto.getDuration());
        assertThat(savedMusic.getDanceability()).isEqualTo(musicDto.getDanceability());
        assertThat(savedMusic.getLoudness()).isEqualTo(musicDto.getLoudness());
        assertThat(savedMusic.isMode()).isEqualTo(musicDto.isMode());
        assertThat(savedMusic.getSpeechiness()).isEqualTo(musicDto.getSpeechiness());
        assertThat(savedMusic.getAcousticness()).isEqualTo(musicDto.getAcousticness());
        assertThat(savedMusic.getValence()).isEqualTo(musicDto.getValence());
        assertThat(savedMusic.getTempo()).isEqualTo(musicDto.getTempo());
        assertThat(savedMusic.getEnergy()).isEqualTo(musicDto.getEnergy());
    }

    @Test
    @DisplayName("음악이 존재할 때 저장을 수행하지 않음")
    void createMusic_WhenMusicExists_ThenDoNotSave() {
        // given
        Music existingMusic = new Music();
        existingMusic.setId(musicDto.getId());
        when(musicRepository.findById(musicDto.getId())).thenReturn(Optional.of(existingMusic));

        // when
        musicService.createMusic(musicDto);

        // then
        verify(musicRepository, never()).save(any());
        verify(genreRepository, never()).findById(any());
    }

    @Test
    @DisplayName("장르가 존재하지 않을 때 예외가 발생한다")
    void createMusic_WhenGenreNotExists_ThenThrowException() {
        // given
        when(musicRepository.findById(musicDto.getId())).thenReturn(Optional.empty());
        when(genreRepository.findById(musicDto.getGenreId())).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> musicService.createMusic(musicDto))
            .isInstanceOf(RuntimeException.class)
            .hasMessageContaining("장르가 존재하지 않음. id: " + musicDto.getGenreId());

        verify(musicRepository, never()).save(any());
    }
}
