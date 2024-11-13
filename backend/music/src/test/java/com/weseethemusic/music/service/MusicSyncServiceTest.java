package com.weseethemusic.music.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

import com.weseethemusic.common.event.AlbumSyncEvent;
import com.weseethemusic.common.event.ArtistSyncEvent;
import com.weseethemusic.common.event.GenreSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent;
import com.weseethemusic.common.event.MusicSyncEvent.EventType;
import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.ArtistMusic;
import com.weseethemusic.music.common.entity.Genre;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.config.TestRabbitMQConfig;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.GenreRepository;
import com.weseethemusic.music.repository.MusicRepository;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(TestRabbitMQConfig.class)
@DirtiesContext
class MusicSyncServiceTest {

    @Autowired
    private MusicRepository musicRepository;
    @Autowired
    private AlbumRepository albumRepository;
    @Autowired
    private ArtistRepository artistRepository;
    @Autowired
    private GenreRepository genreRepository;

    private List<MusicSyncEvent> receivedMusicEvents = new ArrayList<>();
    private List<AlbumSyncEvent> receivedAlbumEvents = new ArrayList<>();
    private List<ArtistSyncEvent> receivedArtistEvents = new ArrayList<>();
    private List<GenreSyncEvent> receivedGenreEvents = new ArrayList<>();

    @BeforeEach
    void setUp() {
        clearAllData();
        clearEvents();
    }

    @Test
    void 의존성이_모두_없는_경우_장르_앨범_아티스트가_모두_없을때() {

        Genre genre = createGenre("Rock");
        Album album = createAlbum("Test Album");
        Artist artist = createArtist("Test Artist");

        Music music = createMusic("Test Music", album, genre);
        addArtistToMusic(music, artist);

        // when - 저장하면서 RabbitMQ로 전송
        Music savedMusic = musicRepository.save(music);

        // Genre 없어서 실패
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedMusicEvents.stream()
                .anyMatch(e -> e.getEventType() == EventType.FAILED_GENRE_NOT_FOUND));

        // Genre 전송
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedGenreEvents.stream()
                .anyMatch(e -> e.getEventType().equals(EventType.STARTED)));

        // Album 전송
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedAlbumEvents.stream()
                .anyMatch(e -> e.getEventType().equals(EventType.STARTED)));

        // Artist 전송
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedArtistEvents.stream()
                .anyMatch(e -> e.getEventType().equals(EventType.STARTED)));
    }

    @Test
    void 장르만_있고_앨범과_아티스트가_없는_경우() {
        // given
        Genre genre = createGenre("Rock");
        Genre savedGenre = genreRepository.save(genre);  // 장르만 먼저 저장

        Album album = createAlbum("Test Album");
        Artist artist = createArtist("Test Artist");

        // Music에 모든 정보 설정
        Music music = createMusic("Test Music", album, savedGenre);
        addArtistToMusic(music, artist);

        // when
        Music savedMusic = musicRepository.save(music);

        // then
        // 앨범이 없어서 실패
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedMusicEvents.stream()
                .anyMatch(e -> e.getEventType() == EventType.FAILED_ALBUM_NOT_FOUND));

        // 나머지 의존성 전송 확인
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedAlbumEvents.stream()
                .anyMatch(e -> e.getEventType().equals(EventType.STARTED)));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedArtistEvents.stream()
                .anyMatch(e -> e.getEventType().equals(EventType.STARTED)));
    }

    @Test
    void 장르와_앨범은_있고_아티스트만_없는경우() {
        // given
        Genre genre = createGenre("Rock");
        Album album = createAlbum("Test Album");
        Genre savedGenre = genreRepository.save(genre);
        Album savedAlbum = albumRepository.save(album);

        Artist artist = createArtist("Test Artist");

        // Music에 모든 정보 설정
        Music music = createMusic("Test Music", savedAlbum, savedGenre);
        addArtistToMusic(music, artist);

        // when
        Music savedMusic = musicRepository.save(music);

        // then
        // 아티스트가 없어서 실패
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedMusicEvents.stream()
                .anyMatch(e -> e.getEventType() == EventType.FAILED_ARTIST_NOT_FOUND));

        // 아티스트 전송 확인
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedArtistEvents.stream()
                .anyMatch(e -> e.getEventType().equals(EventType.STARTED)));
    }

    @Test
    void 모든_의존성이_있는_경우_성공적으로_동기화() {
        // given
        Genre genre = createGenre("Rock");
        Album album = createAlbum("Test Album");
        Artist artist = createArtist("Test Artist");

        Genre savedGenre = genreRepository.save(genre);
        Album savedAlbum = albumRepository.save(album);
        Artist savedArtist = artistRepository.save(artist);

        // Music에 모든 정보 설정
        Music music = createMusic("Test Music", savedAlbum, savedGenre);
        addArtistToMusic(music, savedArtist);

        // when
        Music savedMusic = musicRepository.save(music);

        // then
        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedMusicEvents.stream()
                .anyMatch(e -> e.getEventType() == EventType.STARTED));

        await()
            .atMost(5, TimeUnit.SECONDS)
            .until(() -> receivedMusicEvents.stream()
                .anyMatch(e -> e.getEventType() == EventType.COMPLETED));

        MusicSyncEvent successEvent = receivedMusicEvents.stream()
            .filter(e -> e.getEventType() == EventType.COMPLETED)
            .findFirst()
            .get();

        assertThat(successEvent.getMusic().getAlbumId()).isEqualTo(savedAlbum.getId());
        assertThat(successEvent.getMusic().getGenreId()).isEqualTo(savedGenre.getId());
        assertThat(successEvent.getMusic().getArtistIds()).contains(savedArtist.getId());
    }

    @RabbitListener(queues = "${rabbitmq.queue.genre-sync}")
    public void handleGenreSync(GenreSyncEvent event) {
        receivedGenreEvents.add(event);
    }

    @RabbitListener(queues = "${rabbitmq.queue.music-sync}")
    public void handleMusicSync(MusicSyncEvent event) {
        receivedMusicEvents.add(event);
    }

    @RabbitListener(queues = "${rabbitmq.queue.album-sync}")
    public void handleAlbumSync(AlbumSyncEvent event) {
        receivedAlbumEvents.add(event);
    }

    @RabbitListener(queues = "${rabbitmq.queue.artist-sync}")
    public void handleArtistSync(ArtistSyncEvent event) {
        receivedArtistEvents.add(event);
    }

    private void clearAllData() {
        musicRepository.deleteAll();
        albumRepository.deleteAll();
        artistRepository.deleteAll();
        genreRepository.deleteAll();
    }

    private void clearEvents() {
        receivedMusicEvents.clear();
        receivedAlbumEvents.clear();
        receivedArtistEvents.clear();
        receivedGenreEvents.clear();
    }

    private Genre createGenre(String name) {
        Genre genre = new Genre();
        genre.setName(name);
        return genre;
    }

    private Album createAlbum(String name) {
        Album album = new Album();
        album.setName(name);
        album.setImageName(name + ".jpg");
        album.setReleaseDate(new Date());
        return album;
    }

    private Artist createArtist(String name) {
        Artist artist = new Artist();
        artist.setName(name);
        artist.setImageName(name + ".jpg");
        return artist;
    }

    private Music createMusic(String name, Album album, Genre genre) {
        Music music = new Music();
        music.setName(name);
        music.setAlbum(album);
        music.setGenre(genre);
        music.setDuration(180);
        return music;
    }

    private void addArtistToMusic(Music music, Artist artist) {
        ArtistMusic artistMusic = new ArtistMusic();
        artistMusic.setArtist(artist);
        artistMusic.setMusic(music);
        music.getArtistMusics().add(artistMusic);
    }
}