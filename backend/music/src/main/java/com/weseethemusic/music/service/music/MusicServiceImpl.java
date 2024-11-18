package com.weseethemusic.music.service.music;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Genre;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.common.entity.Playlist;
import com.weseethemusic.music.common.entity.PlaylistMusic;
import com.weseethemusic.music.dto.detail.ArtistDto;
import com.weseethemusic.music.dto.general.GeneralAlbumDto;
import com.weseethemusic.music.dto.general.GeneralDiscographyDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.dto.general.GeneralPlaylistDto;
import com.weseethemusic.music.dto.playlist.RealTodayGenreDto;
import com.weseethemusic.music.dto.playlist.TodayGenreListDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.GenreRepository;
import com.weseethemusic.music.repository.LikeAlbumRepository;
import com.weseethemusic.music.repository.LikeArtistRepository;
import com.weseethemusic.music.repository.LikeMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.repository.PlaylistLikeRepository;
import com.weseethemusic.music.repository.PlaylistMusicRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicServiceImpl implements MusicService {

    private final LikeMusicRepository likeMusicRepository;
    private final ArtistMusicRepository artistMusicRepository;
    private final AlbumRepository albumRepository;
    private final MusicRepository musicRepository;
    private final ArtistRepository artistRepository;
    private final LikeArtistRepository likeArtistRepository;
    private final LikeAlbumRepository likeAlbumRepository;
    private final PlaylistLikeRepository playlistLikeRepository;
    private final PlaylistMusicRepository playlistMusicRepository;
    private final GenreRepository genreRepository;

    // 좋아요 한 아티스트 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<ArtistImageDto> getArtistLikes(long memberId) {
        List<ArtistImageDto> result = new ArrayList<>();
        List<Artist> artists = likeArtistRepository.findAllByMemberId(memberId);

        for (Artist artist : artists) {
            result.add(ArtistImageDto.builder()
                .id(artist.getId())
                .name(artist.getName())
                .image(artist.getImageName())
                .isLike(true)  // 좋아요 목록이므로 무조건 true
                .build());
        }

        return result;
    }

    // 좋아요 한 앨범 목록 조회
    @Override
    @Transactional(readOnly = true)
    public List<GeneralAlbumDto> getAlbumLikes(long memberId) {
        List<GeneralAlbumDto> result = new ArrayList<>();
        List<Album> albums = likeAlbumRepository.findAllByMemberId(memberId);

        for (Album album : albums) {
            List<com.weseethemusic.music.dto.search.ArtistDto> artistDtos = new ArrayList<>();
            List<Music> musics = musicRepository.findAllByAlbum_Id(album.getId());

            for (Music music : musics) {
                List<Artist> artists = artistMusicRepository.findAllByMusic(music);

                for (Artist artist : artists) {
                    artistDtos.add(
                        com.weseethemusic.music.dto.search.ArtistDto.builder().id(artist.getId())
                            .name(artist.getName()).build());
                }
            }

            result.add(GeneralAlbumDto.builder().id(album.getId()).name(album.getName())
                .image(album.getImageName()).artists(artistDtos).build());
        }

        return result;
    }

    // 인기 플레이리스트 조회
    @Override
    @Transactional(readOnly = true)
    public List<GeneralPlaylistDto> getPopularPlaylists(Long memberId) {
        List<GeneralPlaylistDto> result = new ArrayList<>();
        List<Playlist> playlists = playlistLikeRepository.getPopularPlaylists();

        for (Playlist playlist : playlists) {
            PlaylistMusic playlistMusic = playlistMusicRepository.findTopByPlaylistIdOrderByOrderDesc(
                playlist.getId()).orElse(null);
            Music music = null;

            if (playlistMusic != null) {
                music = musicRepository.findById(playlistMusic.getMusicId()).orElse(null);
            }

            boolean isLike = false;
            if (memberId != null) {
                isLike = playlistLikeRepository.existsByMemberIdAndPlaylist_Id(memberId,
                    playlist.getId());
            }

            result.add(GeneralPlaylistDto.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .image(music == null ? "https://picsum.photos/500/500"
                    : music.getAlbum().getImageName())
                .isLike(isLike)
                .build());
        }

        return result;
    }

    // 전체 장르 목록 조회
    @Override
    @Transactional(readOnly = true)
    public TodayGenreListDto getGenres() {
        List<RealTodayGenreDto> result = new ArrayList<>();
        List<Genre> genres = genreRepository.findAll();

        for (Genre genre : genres) {
            result.add(RealTodayGenreDto.fromEntity(genre));
        }

        return TodayGenreListDto.builder().genres(result).build();
    }


    // 인기 30곡 조회
    @Override
    @Transactional(readOnly = true)
    public List<GeneralMusicDto> getPopularMusics(Long memberId) {
        return toMusicDto(likeMusicRepository.getPopularMusics(), memberId);
    }

    // 최신 발매곡 조회
    @Override
    @Transactional(readOnly = true)
    public List<GeneralMusicDto> getLatestMusics(Long memberId) {
        return toMusicDto(musicRepository.getLatestMusics(), memberId);
    }

    // 아티스트 전체 디스코그래피 조회
    @Override
    @Transactional(readOnly = true)
    public List<GeneralDiscographyDto> getAllDiscography(long artistId, Long memberId) {
        artistRepository.findById(artistId).orElseThrow();

        List<GeneralDiscographyDto> result = new ArrayList<>();
        List<Album> albums = albumRepository.getDiscographyByArtist(artistId);

        for (Album album : albums) {
            boolean isLike = false;
            if (memberId != null) {
                isLike = likeAlbumRepository.existsByMemberIdAndAlbum_Id(memberId, album.getId());
            }

            result.add(GeneralDiscographyDto.builder()
                .id(album.getId())
                .name(album.getName())
                .releaseDate(album.getReleaseDate().toString())
                .image(album.getImageName())
                .isLike(isLike)
                .build());
        }

        return result;
    }


    private List<GeneralMusicDto> toMusicDto(List<Music> musics, Long memberId) {
        List<GeneralMusicDto> result = new ArrayList<>();

        for (Music music : musics) {
            List<Artist> artists = artistMusicRepository.findAllByMusic(music);
            List<ArtistDto> artistDtos = new ArrayList<>();

            for (Artist artist : artists) {
                log.info("artist: {}", artist.getName());

                artistDtos.add(
                    ArtistDto.builder().id(artist.getId()).name(artist.getName()).build());
            }

            boolean isLike = false;
            if (memberId != null) {
                isLike = likeMusicRepository.existsByMemberIdAndMusic_Id(memberId, music.getId());
            }

            result.add(GeneralMusicDto.builder()
                .id(music.getId())
                .name(music.getName())
                .artists(artistDtos)
                .image(albumRepository.getAlbumImage(music.getAlbum().getId()))
                .isLike(isLike)
                .build());
        }

        return result;
    }

}
