package com.weseethemusic.music.service;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.common.entity.Playlist;
import com.weseethemusic.music.common.entity.PlaylistMusic;
import com.weseethemusic.music.common.service.PresignedUrlService;
import com.weseethemusic.music.dto.playlist.ArtistResponse;
import com.weseethemusic.music.dto.playlist.CreatePlaylistRequest;
import com.weseethemusic.music.dto.playlist.PlaylistMusicResponse;
import com.weseethemusic.music.dto.playlist.PlaylistResponse;
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.repository.PlaylistRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final MusicRepository musicRepository;
    private final PresignedUrlService presignedUrlService;

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Long createPlaylist(Long memberId, CreatePlaylistRequest request) {
        List<Music> musics = musicRepository.findAllById(request.getMusics());
        if (musics.size() != request.getMusics().size()) {
            log.error("플레이리스트에 음악 추가 불가: 음악이 존재하지 않습니다.");
            throw new IllegalArgumentException("음악이 존재하지 않습니다.");
        }

        // 플레이리스트 생성
        Playlist playlist = new Playlist();
        playlist.setName(request.getTitle());
        playlist.setMemberId(memberId);
        playlist.setCreatedAt(LocalDateTime.now());
        playlist.setUpdatedAt(LocalDateTime.now());

        // 플레이리스트에 음악 추가
        for (int i = 0; i < musics.size(); i++) {
            PlaylistMusic playlistMusic = new PlaylistMusic();
            playlistMusic.setPlaylist(playlist);
            playlistMusic.setMusic(musics.get(i));
            playlistMusic.setTrackOrder(i);
            playlistMusic.setAddedAt(LocalDateTime.now());
            playlist.getPlaylistMusics().add(playlistMusic);
        }

        // 저장 및 id return
        Playlist savedPlaylist = playlistRepository.save(playlist);
        return savedPlaylist.getId();
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deletePlaylist(Long memberId, Long playlistId) {
        try {
            Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("플레이리스트를 찾을 수 없습니다."));

            // 플레이리스트 소유자 확인
            if (!playlist.getMemberId().equals(memberId.toString())) {
                throw new RuntimeException("플레이리스트 삭제 권한이 없습니다.");
            }

            playlistRepository.delete(playlist);

        } catch (Exception e) {
            throw new RuntimeException("플레이리스트 삭제 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlaylistMusicResponse> getPlaylistMusics(Long playlistId) {
        try {
            Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new RuntimeException("플레이리스트를 찾을 수 없습니다."));

            List<PlaylistMusic> playlistMusics = new ArrayList<>(playlist.getPlaylistMusics());
            // trackOrder로 정렬
            Collections.sort(playlistMusics, new Comparator<PlaylistMusic>() {
                @Override
                public int compare(PlaylistMusic pm1, PlaylistMusic pm2) {
                    return Integer.compare(pm1.getTrackOrder(), pm2.getTrackOrder());
                }
            });

            List<PlaylistMusicResponse> responses = new ArrayList<>();
            for (PlaylistMusic playlistMusic : playlistMusics) {
                Music music = playlistMusic.getMusic();
                Album album = music.getAlbum();

                // 아티스트 목록 생성
                List<ArtistResponse> artistResponses = new ArrayList<>();
                for (Artist artist : music.getArtists()) {
                    artistResponses.add(new ArtistResponse(artist.getId(), artist.getName()));
                }

                // presignedUrl 생성
                String presignedUrl = presignedUrlService.getPresignedUrl(album.getImageName());

                // response 객체 생성 및 추가
                PlaylistMusicResponse response = new PlaylistMusicResponse(
                    music.getId(),
                    music.getName(),
                    presignedUrl,
                    formatDuration(music.getDuration()),
                    artistResponses
                );
                responses.add(response);
            }

            return responses;
        } catch (Exception e) {
            throw new RuntimeException("플레이리스트 음악 조회 중 오류가 발생했습니다.", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlaylistResponse> getMyPlaylists(Long memberId) {
        try {
            List<Playlist> playlists = playlistRepository.findByMemberId(memberId);
            List<PlaylistResponse> responses = new ArrayList<>();

            for (Playlist playlist : playlists) {
                // 플레이리스트의 총 곡 수
                int totalMusicCount = playlist.getPlaylistMusics().size();

                // 총 재생 시간
                int totalSeconds = 0;
                String latestImage = null;
                int latestTrackOrder = -1;

                List<PlaylistMusic> playlistMusics = playlist.getPlaylistMusics();
                for (PlaylistMusic playlistMusic : playlistMusics) {
                    totalSeconds += playlistMusic.getMusic().getDuration();

                    // 가장 최근에 추가된 곡 이미지
                    if (playlistMusic.getTrackOrder() > latestTrackOrder) {
                        latestTrackOrder = playlistMusic.getTrackOrder();
                        latestImage = playlistMusic.getMusic().getAlbum().getImageName();
                    }
                }

                // presignedUrl
                String imageUrl = latestImage != null ?
                    presignedUrlService.getPresignedUrl(latestImage) : null;

                PlaylistResponse response = new PlaylistResponse(
                    playlist.getId(),
                    playlist.getName(),
                    imageUrl,
                    formatTotalDuration(totalSeconds),
                    totalMusicCount
                );

                responses.add(response);
            }

            return responses;
        } catch (Exception e) {
            throw new RuntimeException("플레이리스트 목록 조회 중 오류가 발생했습니다.", e);
        }
    }

    private String formatDuration(int seconds) {
        int minutes = seconds / 60;
        int remainingSeconds = seconds % 60;
        return String.format("%d:%02d", minutes, remainingSeconds);
    }

    private String formatTotalDuration(int totalSeconds) {
        int hours = totalSeconds / 3600;
        int minutes = (totalSeconds % 3600) / 60;

        if (hours > 0) {
            return String.format("%d시간 %d분", hours, minutes);
        } else {
            return String.format("%d분", minutes);
        }
    }
}
