package com.weseethemusic.music.service;

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
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.repository.PlaylistMusicRepository;
import com.weseethemusic.music.repository.PlaylistRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

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

    // 음악 검색
    @Override
    public SearchDto searchMusic(String keyword) {
        List<MusicDto> musics = searchAllMusics(keyword, Pageable.ofSize(5));
        List<AlbumDto> albums = searchAllAlbums(keyword, Pageable.ofSize(5));
        List<ArtistImageDto> artists = searchAllArtists(keyword, Pageable.ofSize(5));
        List<PlaylistDto> playlists = searchAllPlaylists(keyword, Pageable.ofSize(5));

        return SearchDto.builder().musics(musics).albums(albums).artists(artists)
            .playlists(playlists).build();
    }

    // 음악 모두 보기 검색
    @Override
    public List<MusicDto> searchAllMusics(String keyword, Pageable pageable) {
        List<MusicDto> result = new ArrayList<>();
        List<Music> musics = musicRepository.findAllByName(keyword, pageable);

        for (Music music : musics) {
            List<ArtistDto> artistDtos = new ArrayList<>();
            List<Artist> artists = artistMusicRepository.findAllByMusic(music);

            for (Artist artist : artists) {
                artistDtos.add(
                    ArtistDto.builder().id(artist.getId()).name(artist.getName()).build());
            }

            result.add(MusicDto.builder().id(music.getId()).name(music.getName())
                .albumImage(albumRepository.getAlbumImage(music.getAlbum().getId()))
                .artists(artistDtos).build());
        }

        return result;
    }

    // 플레이리스트 모두 보기 검색
    @Override
    public List<PlaylistDto> searchAllPlaylists(String keyword, Pageable pageable) {
        List<PlaylistDto> result = new ArrayList<>();
        List<Playlist> playlists = playlistRepository.findAllByName(keyword, pageable);

        for (Playlist playlist : playlists) {
            PlaylistMusic playlistMusic = playlistMusicRepository.findTopByPlaylistIdOrderByOrderDesc(
                playlist.getId()).orElse(null);

            if (playlistMusic == null) {
                continue;
            }

            Music music = musicRepository.findById(playlistMusic.getMusicId()).orElseThrow();

            result.add(PlaylistDto.builder().id(playlist.getId()).name(playlist.getName())
                .image(albumRepository.getAlbumImage(music.getAlbum().getId())).build());
        }

        return result;
    }

    // 앨범 모두 보기 검색
    @Override
    public List<AlbumDto> searchAllAlbums(String keyword, Pageable pageable) {
        List<AlbumDto> result = new ArrayList<>();
        List<Album> albums = albumRepository.findAllByName(keyword, pageable);

        for (Album album : albums) {
            result.add(AlbumDto.builder().id(album.getId()).name(album.getName())
                .image(album.getImageName()).build());
        }

        return result;
    }

    // 아티스트 모두 보기 검색
    @Override
    public List<ArtistImageDto> searchAllArtists(String keyword, Pageable pageable) {
        List<ArtistImageDto> result = new ArrayList<>();
        List<Artist> artists = artistRepository.findAllByName(keyword, pageable);

        for (Artist artist : artists) {
            result.add(ArtistImageDto.builder().id(artist.getId()).name(artist.getName())
                .image(artist.getImageName()).build());
        }

        return result;
    }

}
