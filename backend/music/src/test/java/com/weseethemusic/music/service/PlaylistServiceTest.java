package com.weseethemusic.music.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.PlaylistLike;
import com.weseethemusic.music.dto.playlist.PlaylistMusicResponse;
import com.weseethemusic.music.dto.playlist.PlaylistResponse;
import com.weseethemusic.music.repository.PlaylistLikeRepository;
import com.weseethemusic.music.service.playlist.PlaylistServiceImpl;
import java.time.LocalDateTime;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.common.entity.Playlist;
import com.weseethemusic.music.common.entity.PlaylistMusic;
import com.weseethemusic.music.common.service.PresignedUrlService;
import com.weseethemusic.music.dto.playlist.CreatePlaylistRequest;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.repository.PlaylistMusicRepository;
import com.weseethemusic.music.repository.PlaylistRepository;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class PlaylistServiceTest {

    @Mock
    private PlaylistRepository playlistRepository;
    @Mock
    private PlaylistMusicRepository playlistMusicRepository;
    @Mock
    private MusicRepository musicRepository;
    @Mock
    private PresignedUrlService presignedUrlService;
    @Mock
    private ArtistMusicRepository artistMusicRepository;
    @Mock
    private PlaylistLikeRepository playlistLikeRepository;

    @InjectMocks
    private PlaylistServiceImpl playlistService;

    @Test
    @DisplayName("플레이리스트 생성 - 성공")
    void createPlaylist_Success() {
        // given
        Long memberId = 1L;
        CreatePlaylistRequest request = new CreatePlaylistRequest();
        request.setTitle("테스트 플레이리스트");
        request.setMusics(List.of(1L, 2L));

        List<Music> musics = Arrays.asList(
            createMusic(1L),
            createMusic(2L)
        );

        Playlist savedPlaylist = createPlaylist(1L, memberId, "테스트 플레이리스트");

        // when
        when(musicRepository.findAllById(request.getMusics())).thenReturn(musics);
        when(playlistRepository.save(any(Playlist.class))).thenReturn(savedPlaylist);

        // then
        Long playlistId = playlistService.createPlaylist(memberId, request);
        assertThat(playlistId).isEqualTo(savedPlaylist.getId());

        verify(playlistRepository).save(any(Playlist.class));
        verify(playlistMusicRepository, times(2)).save(any(PlaylistMusic.class));
    }

    @Test
    @DisplayName("플레이리스트 생성 - 존재하지 않는 음악")
    void createPlaylist_WithNonExistentMusic() {
        // given
        Long memberId = 1L;
        CreatePlaylistRequest request = new CreatePlaylistRequest();
        request.setTitle("테스트 플레이리스트");
        request.setMusics(List.of(1L, 2L));

        // 하나의 음악만 존재
        when(musicRepository.findAllById(request.getMusics()))
            .thenReturn(List.of(createMusic(1L)));

        // then
        assertThrows(RuntimeException.class, () ->
            playlistService.createPlaylist(memberId, request));
    }

    @Test
    @DisplayName("플레이리스트 삭제 - 성공")
    void deletePlaylist_Success() {
        // given
        Long memberId = 1L;
        Long playlistId = 1L;
        Playlist playlist = createPlaylist(playlistId, memberId, "테스트 플레이리스트");

        when(playlistRepository.findById(playlistId)).thenReturn(Optional.of(playlist));

        // when
        playlistService.deletePlaylist(memberId, playlistId);

        // then
        verify(playlistMusicRepository).deleteByPlaylistId(playlistId);
        verify(playlistRepository).delete(playlist);
    }

    @Test
    @DisplayName("플레이리스트 삭제 - 권한 없음")
    void deletePlaylist_NoPermission() {
        // given
        Long memberId = 1L;
        Long wrongMemberId = 2L;
        Long playlistId = 1L;
        Playlist playlist = createPlaylist(playlistId, memberId, "테스트 플레이리스트");

        when(playlistRepository.findById(playlistId)).thenReturn(Optional.of(playlist));

        // then
        assertThrows(RuntimeException.class, () ->
            playlistService.deletePlaylist(wrongMemberId, playlistId));
    }

    @Test
    @DisplayName("플레이리스트 음악 조회 - 성공")
    void getPlaylistMusics_Success() {
        // given
        Long playlistId = 1L;
        List<PlaylistMusic> playlistMusics = Arrays.asList(
            createPlaylistMusic(1L, playlistId, 1L, 0),
            createPlaylistMusic(2L, playlistId, 2L, 1)
        );

        List<Music> musics = Arrays.asList(
            createMusicWithAlbumAndArtists(1L),
            createMusicWithAlbumAndArtists(2L)
        );

        when(playlistMusicRepository.findByPlaylistIdOrderByOrder(playlistId))
            .thenReturn(playlistMusics);
        when(musicRepository.findAllById(any())).thenReturn(musics);
        when(presignedUrlService.getPresignedUrl(any())).thenReturn("/test.jpg");
        when(artistMusicRepository.findAllByMusic(any())).thenReturn(createArtists());

        // when
        List<PlaylistMusicResponse> responses = playlistService.getPlaylistMusics(playlistId);

        // then
        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getId()).isEqualTo(1L);
        assertThat(responses.get(1).getId()).isEqualTo(2L);
    }

    @Test
    @DisplayName("내 플레이리스트 목록 조회 - 성공")
    void getMyPlaylists_Success() {
        // given
        Long memberId = 1L;
        List<Playlist> playlists = List.of(
            createPlaylist(1L, memberId, "플레이리스트1"),
            createPlaylist(2L, memberId, "플레이리스트2")
        );

        when(playlistRepository.findByMemberId(memberId)).thenReturn(playlists);
        when(playlistMusicRepository.findByPlaylistIdOrderByOrder(any()))
            .thenReturn(createPlaylistMusics());
        when(playlistMusicRepository.findTopByPlaylistIdOrderByOrderDesc(any()))
            .thenReturn(Optional.of(createPlaylistMusic(1L, 1L, 1L, 0)));
        when(musicRepository.findById(any()))
            .thenReturn(Optional.of(createMusicWithAlbumAndArtists(1L)));
        when(presignedUrlService.getPresignedUrl(any())).thenReturn("/test.jpg");

        // when
        List<PlaylistResponse> responses = playlistService.getMyPlaylists(memberId);

        // then
        assertThat(responses).hasSize(2);
    }

    // Helper methods
    private Playlist createPlaylist(Long id, Long memberId, String name) {
        Playlist playlist = new Playlist();
        playlist.setId(id);
        playlist.setMemberId(memberId);
        playlist.setName(name);
        playlist.setCreatedAt(LocalDateTime.now());
        playlist.setUpdatedAt(LocalDateTime.now());
        return playlist;
    }

    private Music createMusic(Long id) {
        Music music = new Music();
        music.setId(id);
        music.setName("Test Music " + id);
        music.setDuration(180);
        return music;
    }

    private Music createMusicWithAlbumAndArtists(Long id) {
        Music music = createMusic(id);
        Album album = new Album();
        album.setId(id);
        album.setImageName("test.jpg");
        music.setAlbum(album);
        return music;
    }

    private PlaylistMusic createPlaylistMusic(Long id, Long playlistId, Long musicId,
        double order) {
        PlaylistMusic playlistMusic = new PlaylistMusic();
        playlistMusic.setId(String.valueOf(id));
        playlistMusic.setPlaylistId(playlistId);
        playlistMusic.setMusicId(musicId);
        playlistMusic.setOrder(order);
        playlistMusic.setAddedAt(LocalDateTime.now());
        return playlistMusic;
    }

    private List<PlaylistMusic> createPlaylistMusics() {
        return Arrays.asList(
            createPlaylistMusic(1L, 1L, 1L, 0),
            createPlaylistMusic(2L, 1L, 2L, 1)
        );
    }

    private List<Artist> createArtists() {
        return Arrays.asList(
            createArtist(1L, "Artist 1"),
            createArtist(2L, "Artist 2")
        );
    }

    private Artist createArtist(Long id, String name) {
        Artist artist = new Artist();
        artist.setId(id);
        artist.setName(name);
        return artist;
    }

    @Test
    @DisplayName("플레이리스트 수정 - 성공")
    void updatePlaylist_Success() {
        // given
        Long playlistId = 1L;
        String newTitle = "수정된 플레이리스트";
        List<Long> newMusicIds = Arrays.asList(1L, 2L);

        Playlist playlist = createPlaylist(playlistId, 1L, "원본 플레이리스트");
        List<Music> musics = Arrays.asList(
            createMusicWithAlbumAndArtists(1L),
            createMusicWithAlbumAndArtists(2L)
        );

        when(playlistRepository.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(musicRepository.findAllById(newMusicIds)).thenReturn(musics);
        when(playlistMusicRepository.findByPlaylistIdOrderByOrder(playlistId))
            .thenReturn(createPlaylistMusics());
        when(artistMusicRepository.findAllByMusic(any())).thenReturn(createArtists());
        when(presignedUrlService.getPresignedUrl(any())).thenReturn("/test.jpg");

        // when
        List<PlaylistMusicResponse> response = playlistService.updatePlaylist(playlistId, newTitle,
            newMusicIds);

        // then
        assertThat(response).isNotNull();
        verify(playlistMusicRepository).deleteByPlaylistId(playlistId);
        verify(playlistRepository).save(any(Playlist.class));
    }

    @Test
    @DisplayName("플레이리스트 좋아요 토글 - 좋아요 추가")
    void likePlaylist_AddLike_Success() {
        // given
        Long memberId = 1L;
        Long playlistId = 1L;
        Playlist playlist = createPlaylist(playlistId, 2L, "Test Playlist");  // 다른 사용자의 플레이리스트

        when(playlistLikeRepository.findByMemberIdAndPlaylistId(memberId, playlistId))
            .thenReturn(Optional.empty());
        when(playlistRepository.findById(playlistId))
            .thenReturn(Optional.of(playlist));

        // when
        playlistService.likePlaylist(playlistId, memberId);

        // then
        verify(playlistLikeRepository).save(any(PlaylistLike.class));
    }

    @Test
    @DisplayName("플레이리스트 좋아요 토글 - 좋아요 취소")
    void likePlaylist_RemoveLike_Success() {
        // given
        Long memberId = 1L;
        Long playlistId = 1L;
        PlaylistLike existingLike = new PlaylistLike();
        existingLike.setId(1L);
        existingLike.setMemberId(memberId);
        existingLike.setPlaylist(createPlaylist(playlistId, 2L, "Test Playlist"));

        when(playlistLikeRepository.findByMemberIdAndPlaylistId(memberId, playlistId))
            .thenReturn(Optional.of(existingLike));

        // when
        playlistService.likePlaylist(playlistId, memberId);

        // then
        verify(playlistLikeRepository).delete(existingLike);
    }

    @Test
    @DisplayName("플레이리스트 좋아요 삭제 - 성공")
    void disLikePlaylist_Success() {
        // given
        Long memberId = 1L;
        Long playlistId = 1L;
        PlaylistLike playlistLike = new PlaylistLike();
        playlistLike.setId(1L);
        playlistLike.setMemberId(memberId);
        playlistLike.setPlaylist(createPlaylist(playlistId, 2L, "Test Playlist"));

        when(playlistLikeRepository.findByMemberIdAndPlaylistId(memberId, playlistId))
            .thenReturn(Optional.of(playlistLike));

        // when
        playlistService.disLikePlaylist(playlistId, memberId);

        // then
        verify(playlistLikeRepository).delete(playlistLike);
    }

    @Test
    @DisplayName("플레이리스트 좋아요 삭제 - 존재하지 않는 좋아요")
    void disLikePlaylist_NotFound() {
        // given
        Long memberId = 1L;
        Long playlistId = 1L;

        when(playlistLikeRepository.findByMemberIdAndPlaylistId(memberId, playlistId))
            .thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () ->
            playlistService.disLikePlaylist(playlistId, memberId));
    }

    @Test
    @DisplayName("전체 플레이리스트 목록 조회(내 플레이리스트 + 좋아요한 플레이리스트) - 성공")
    void getMyPlaylistsAll_Success() {
        // given
        Long memberId = 1L;

        // 내가 만든 플레이리스트
        Playlist myPlaylist = createPlaylist(1L, memberId, "내 플레이리스트");

        // 내가 좋아요한 다른 사람의 플레이리스트
        Playlist likedPlaylist = createPlaylist(2L, 2L, "좋아요한 플레이리스트");
        PlaylistLike playlistLike = new PlaylistLike();
        playlistLike.setId(1L);
        playlistLike.setMemberId(memberId);
        playlistLike.setPlaylist(likedPlaylist);

        List<Playlist> myPlaylists = List.of(myPlaylist);
        List<PlaylistLike> likedPlaylists = List.of(playlistLike);

        when(playlistRepository.findByMemberId(memberId)).thenReturn(myPlaylists);
        when(playlistLikeRepository.findByMemberId(memberId)).thenReturn(likedPlaylists);
        when(playlistMusicRepository.findByPlaylistIdOrderByOrder(any()))
            .thenReturn(createPlaylistMusics());
        when(playlistMusicRepository.findTopByPlaylistIdOrderByOrderDesc(any()))
            .thenReturn(Optional.of(createPlaylistMusic(1L, 1L, 1L, 0)));
        when(musicRepository.findById(any()))
            .thenReturn(Optional.of(createMusicWithAlbumAndArtists(1L)));
        when(presignedUrlService.getPresignedUrl(any())).thenReturn("/test.jpg");

        // when
        List<PlaylistResponse> responses = playlistService.getMyPlaylistsAll(memberId);

        // then
        assertThat(responses).hasSize(2); // 내 플레이리스트 1개 + 좋아요한 플레이리스트 1개
        verify(playlistRepository).findByMemberId(memberId);
        verify(playlistLikeRepository).findByMemberId(memberId);
    }

    @Test
    @DisplayName("플레이리스트에 단일 음악 추가 - 성공")
    void updatePlaylistOne_Success() {
        // given
        Long playlistId = 1L;
        Long musicId = 2L;

        Playlist playlist = createPlaylist(playlistId, 1L, "테스트 플레이리스트");
        Music music = createMusicWithAlbumAndArtists(musicId);

        PlaylistMusic newPlaylistMusic = createPlaylistMusic(1L, playlistId, musicId, 1000.0);
        List<PlaylistMusic> playlistMusics = Arrays.asList(newPlaylistMusic);

        when(playlistRepository.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(musicRepository.findById(musicId)).thenReturn(Optional.of(music));
        when(playlistMusicRepository.findTopByPlaylistIdOrderByOrderDesc(playlistId))
            .thenReturn(Optional.of(newPlaylistMusic));
        when(playlistMusicRepository.findByPlaylistIdOrderByOrder(playlistId))
            .thenReturn(playlistMusics);

        when(musicRepository.findAllById(Collections.singletonList(musicId)))
            .thenReturn(Collections.singletonList(music));

        when(artistMusicRepository.findAllByMusic(music)).thenReturn(createArtists());
        when(presignedUrlService.getPresignedUrl(any())).thenReturn("/test.jpg");

        // when
        List<PlaylistMusicResponse> response = playlistService.updatePlaylistOne(playlistId, musicId);

        // then
        assertThat(response).isNotNull();
        assertThat(response).hasSize(1);
        assertThat(response.get(0).getId()).isEqualTo(musicId);
        verify(playlistRepository).save(any(Playlist.class));
        verify(playlistMusicRepository).save(argThat(pm ->
            pm.getMusicId().equals(musicId) &&
                pm.getPlaylistId().equals(playlistId)
        ));
    }

    @Test
    @DisplayName("플레이리스트에 단일 음악 추가 - 플레이리스트 없음")
    void updatePlaylistOne_PlaylistNotFound() {
        // given
        Long playlistId = 1L;
        Long musicId = 1L;

        when(playlistRepository.findById(playlistId)).thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () ->
            playlistService.updatePlaylistOne(playlistId, musicId));
    }

    @Test
    @DisplayName("플레이리스트에 단일 음악 추가 - 음악 없음")
    void updatePlaylistOne_MusicNotFound() {
        // given
        Long playlistId = 1L;
        Long musicId = 1L;
        Playlist playlist = createPlaylist(playlistId, 1L, "테스트 플레이리스트");

        when(playlistRepository.findById(playlistId)).thenReturn(Optional.of(playlist));
        when(musicRepository.findById(musicId)).thenReturn(Optional.empty());

        // then
        assertThrows(RuntimeException.class, () ->
            playlistService.updatePlaylistOne(playlistId, musicId));
    }
}