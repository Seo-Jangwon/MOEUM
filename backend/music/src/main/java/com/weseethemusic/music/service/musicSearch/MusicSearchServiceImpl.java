package com.weseethemusic.music.service.musicSearch;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.common.entity.Playlist;
import com.weseethemusic.music.common.entity.PlaylistMusic;
import com.weseethemusic.music.dto.search.AlbumDto;
import com.weseethemusic.music.dto.search.ArtistDto;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.dto.search.MusicDto;
import com.weseethemusic.music.dto.search.PlaylistDto;
import com.weseethemusic.music.dto.search.SearchDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.LikeAlbumRepository;
import com.weseethemusic.music.repository.LikeArtistRepository;
import com.weseethemusic.music.repository.LikeMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.repository.PlaylistLikeRepository;
import com.weseethemusic.music.repository.PlaylistMusicRepository;
import com.weseethemusic.music.repository.PlaylistRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicSearchServiceImpl implements MusicSearchService {

    private final MusicRepository musicRepository;
    private final ArtistMusicRepository artistMusicRepository;
    private final AlbumRepository albumRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistMusicRepository playlistMusicRepository;
    private final ArtistRepository artistRepository;
    private final LikeMusicRepository likeMusicRepository;
    private final LikeAlbumRepository likeAlbumRepository;
    private final LikeArtistRepository likeArtistRepository;
    private final PlaylistLikeRepository playlistLikeRepository;

    // 음악 검색
    @Override
    @Transactional(readOnly = true)
    public SearchDto searchMusic(String keyword, Long memberId) {
        List<MusicDto> musics = searchAllMusics(keyword, Pageable.ofSize(5), memberId);
        List<AlbumDto> albums = searchAllAlbums(keyword, Pageable.ofSize(5), memberId);
        List<ArtistImageDto> artists = searchAllArtists(keyword, Pageable.ofSize(5), memberId);
        List<PlaylistDto> playlists = searchAllPlaylists(keyword, Pageable.ofSize(5), memberId);

        return SearchDto.builder().musics(musics).albums(albums).artists(artists)
            .playlists(playlists).build();
    }

    // 음악 모두 보기 검색
    @Override
    @Transactional(readOnly = true)
    public List<MusicDto> searchAllMusics(String keyword, Pageable pageable, Long memberId) {
        List<MusicDto> result = new ArrayList<>();
        List<Music> musics = musicRepository.findAllByName(keyword, pageable);

        for (Music music : musics) {
            List<ArtistDto> artistDtos = new ArrayList<>();
            List<Artist> artists = artistMusicRepository.findAllByMusic(music);

            for (Artist artist : artists) {
                artistDtos.add(
                    ArtistDto.builder().id(artist.getId()).name(artist.getName()).build());
            }

            boolean isLike = false;
            if (memberId != null) {
                isLike = likeMusicRepository.existsByMemberIdAndMusic_Id(memberId, music.getId());
            }

            result.add(MusicDto.builder()
                .id(music.getId())
                .name(music.getName())
                .albumImage(albumRepository.getAlbumImage(music.getAlbum().getId()))
                .artists(artistDtos)
                .isLike(isLike)
                .build());
        }

        return result;
    }

    // 플레이리스트 모두 보기 검색
    @Override
    @Transactional(readOnly = true)
    public List<PlaylistDto> searchAllPlaylists(String keyword, Pageable pageable, Long memberId) {
        List<PlaylistDto> result = new ArrayList<>();
        List<Playlist> playlists = playlistRepository.findAllByName(keyword, pageable);

        for (Playlist playlist : playlists) {
            PlaylistMusic playlistMusic = playlistMusicRepository.findTopByPlaylistIdOrderByOrderDesc(
                playlist.getId()).orElse(null);

            if (playlistMusic == null) {
                continue;
            }

            Music music = musicRepository.findById(playlistMusic.getMusicId()).orElseThrow();

            boolean isLike = false;
            if (memberId != null) {
                isLike = playlistLikeRepository.existsByMemberIdAndPlaylist_Id(memberId,
                    playlist.getId());
            }

            result.add(PlaylistDto.builder()
                .id(playlist.getId())
                .name(playlist.getName())
                .image(albumRepository.getAlbumImage(music.getAlbum().getId()))
                .isLike(isLike)
                .build());
        }

        return result;
    }

    // 앨범 모두 보기 검색
    @Override
    @Transactional(readOnly = true)
    public List<AlbumDto> searchAllAlbums(String keyword, Pageable pageable, Long memberId) {
        List<AlbumDto> result = new ArrayList<>();
        List<Album> albums = albumRepository.findAllByName(keyword, pageable);

        for (Album album : albums) {
            boolean isLike = false;
            if (memberId != null) {
                isLike = likeAlbumRepository.existsByMemberIdAndAlbum_Id(memberId, album.getId());
            }

            result.add(AlbumDto.builder()
                .id(album.getId())
                .name(album.getName())
                .image(album.getImageName())
                .isLike(isLike)
                .build());
        }

        return result;
    }


    // 아티스트 모두 보기 검색
    @Override
    @Transactional(readOnly = true)
    public List<ArtistImageDto> searchAllArtists(String keyword, Pageable pageable, Long memberId) {
        List<ArtistImageDto> result = new ArrayList<>();
        List<Artist> artists = artistRepository.findAllByName(keyword, pageable);

        for (Artist artist : artists) {
            boolean isLike = false;
            if (memberId != null) {
                isLike = likeArtistRepository.existsByMemberIdAndArtist_Id(memberId,
                    artist.getId());
            }

            result.add(ArtistImageDto.builder()
                .id(artist.getId())
                .name(artist.getName())
                .image(artist.getImageName())
                .isLike(isLike)
                .build());
        }

        return result;
    }

}
