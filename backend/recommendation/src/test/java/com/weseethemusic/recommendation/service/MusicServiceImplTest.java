package com.weseethemusic.recommendation.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.recommendation.common.entity.Album;
import com.weseethemusic.recommendation.common.entity.Artist;
import com.weseethemusic.recommendation.common.entity.Genre;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.repository.AlbumRepository;
import com.weseethemusic.recommendation.repository.ArtistRepository;
import com.weseethemusic.recommendation.repository.GenreRepository;
import com.weseethemusic.recommendation.repository.MusicRepository;
import com.weseethemusic.recommendation.service.music.MusicServiceImpl;
import java.util.Arrays;
import java.util.Collections;
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
class MusicServiceImplTest {

    @Mock
    private MusicRepository musicRepository;
    @Mock
    private GenreRepository genreRepository;
    @Mock
    private AlbumRepository albumRepository;
    @Mock
    private ArtistRepository artistRepository;

    @InjectMocks
    private MusicServiceImpl musicService;

    @Captor
    private ArgumentCaptor<Music> musicCaptor;

    private MusicDto musicDto;
    private Genre genre;
    private Album album;
    private Artist artist1;
    private Artist artist2;

    @BeforeEach
    void setUp() {
        // 테스트 데이터 준비
        musicDto = MusicDto.builder()
            .id(1L)
            .name("Test Music")
            .albumId(1L)
            .genreId(1)
            .duration(180)
            .artistIds(Arrays.asList(1L, 2L))
            .danceability(0.8)
            .loudness(-5.5)
            .mode(true)
            .speechiness(0.1)
            .acousticness(0.2)
            .valence(0.7)
            .tempo(120.0)
            .energy(0.9)
            .build();

        genre = new Genre(1, "Pop");
        album = new Album(1L, "Test Album", null, "test.jpg");
        artist1 = new Artist(1L, "Artist 1", "artist1.jpg");
        artist2 = new Artist(2L, "Artist 2", "artist2.jpg");
    }

    @Test
    @DisplayName("모든 데이터가 정상일 때 음악이 올바르게 저장되어야 한다")
    void shouldSaveMusicCorrectly() {
        // given
        when(genreRepository.findById(musicDto.getGenreId()))
            .thenReturn(Optional.of(genre));
        when(albumRepository.findById(musicDto.getAlbumId()))
            .thenReturn(Optional.of(album));
        when(artistRepository.findById(1L))
            .thenReturn(Optional.of(artist1));
        when(artistRepository.findById(2L))
            .thenReturn(Optional.of(artist2));

        // when
        musicService.createMusic(musicDto);

        // then
        verify(musicRepository).save(musicCaptor.capture());
        Music savedMusic = musicCaptor.getValue();

        assertThat(savedMusic.getId()).isEqualTo(musicDto.getId());
        assertThat(savedMusic.getName()).isEqualTo(musicDto.getName());
        assertThat(savedMusic.getGenre()).isEqualTo(genre);
        assertThat(savedMusic.getAlbum()).isEqualTo(album);
        assertThat(savedMusic.getDuration()).isEqualTo(musicDto.getDuration());
        assertThat(savedMusic.getDanceability()).isEqualTo(musicDto.getDanceability());
        assertThat(savedMusic.getLoudness()).isEqualTo(musicDto.getLoudness());
        assertThat(savedMusic.isMode()).isEqualTo(musicDto.isMode());
        assertThat(savedMusic.getSpeechiness()).isEqualTo(musicDto.getSpeechiness());
        assertThat(savedMusic.getAcousticness()).isEqualTo(musicDto.getAcousticness());
        assertThat(savedMusic.getValence()).isEqualTo(musicDto.getValence());
        assertThat(savedMusic.getTempo()).isEqualTo(musicDto.getTempo());
        assertThat(savedMusic.getEnergy()).isEqualTo(musicDto.getEnergy());
        assertThat(savedMusic.getArtistMusics()).hasSize(2);
    }

    @Test
    @DisplayName("이미 존재하는 음악은 저장되지 않아야 한다")
    void shouldNotSaveExistingMusic() {
        // given
        when(musicRepository.findById(musicDto.getId()))
            .thenReturn(Optional.of(new Music()));

        // when
        musicService.createMusic(musicDto);

        // then
        verify(musicRepository, times(0)).save(any());
    }

    @Test
    @DisplayName("장르가 없을 경우 예외가 발생해야 한다")
    void shouldThrowExceptionWhenGenreNotFound() {
        // given
        when(genreRepository.findById(musicDto.getGenreId()))
            .thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> musicService.createMusic(musicDto));
        verify(musicRepository, times(0)).save(any());
    }

    @Test
    @DisplayName("앨범이 없을 경우 예외가 발생해야 한다")
    void shouldThrowExceptionWhenAlbumNotFound() {
        // given
        when(genreRepository.findById(musicDto.getGenreId()))
            .thenReturn(Optional.of(genre));
        when(albumRepository.findById(musicDto.getAlbumId()))
            .thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> musicService.createMusic(musicDto));
        verify(musicRepository, times(0)).save(any());
    }

    @Test
    @DisplayName("아티스트가 없을 경우 예외가 발생해야 한다")
    void shouldThrowExceptionWhenArtistNotFound() {
        // given
        when(genreRepository.findById(musicDto.getGenreId()))
            .thenReturn(Optional.of(genre));
        when(albumRepository.findById(musicDto.getAlbumId()))
            .thenReturn(Optional.of(album));
        when(artistRepository.findById(1L))
            .thenReturn(Optional.of(artist1));
        when(artistRepository.findById(2L))
            .thenReturn(Optional.empty());

        // when & then
        assertThrows(RuntimeException.class, () -> musicService.createMusic(musicDto));
        verify(musicRepository, times(0)).save(any());
    }

    @Test
    @DisplayName("아티스트 ID가 비어있어도 음악이 생성되어야 한다")
    void shouldCreateMusicWithoutArtists() {
        // given
        musicDto.setArtistIds(Collections.emptyList());
        when(genreRepository.findById(musicDto.getGenreId()))
            .thenReturn(Optional.of(genre));
        when(albumRepository.findById(musicDto.getAlbumId()))
            .thenReturn(Optional.of(album));

        // when
        musicService.createMusic(musicDto);

        // then
        verify(musicRepository).save(musicCaptor.capture());
        Music savedMusic = musicCaptor.getValue();
        assertThat(savedMusic.getArtistMusics()).isEqualTo(Collections.emptySet());
    }
}