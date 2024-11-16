package com.weseethemusic.music.service;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.dto.detail.*;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.MusicRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MusicDetailServiceImpl implements MusicDetailService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final MusicRepository musicRepository;
    private final ArtistMusicRepository artistMusicRepository;

    // 앨범 상세 정보 조회
    @Override
    public AlbumDetailDto getAlbumDetail(Long albumId) {
        Album album = albumRepository.findById(albumId).orElse(null);

        if (album == null) {
            return new AlbumDetailDto();
        }

        AlbumDetailDto result = AlbumDetailDto.builder().id(album.getId()).name(album.getName())
            .releaseDate(album.getReleaseDate().toString()).image(album.getImageName()).build();

        int duration = 0;

        // TODO: query 최적화

        List<Music> musics = musicRepository.findAllByAlbum_Id(albumId);
        List<MusicImageDto> musicDtos = new ArrayList<>();
        Set<ArtistImageDto> artistSet = new HashSet<>();

        for (Music music : musics) {
            duration += music.getDuration();

            List<Artist> artistList = artistMusicRepository.findAllByMusic(music);
            List<ArtistImageDto> artistDtos = new ArrayList<>();

            for (Artist artist : artistList) {
                ArtistImageDto dto = ArtistImageDto.builder().id(artist.getId())
                    .name(artist.getName()).image(artist.getImageName()).build();

                artistDtos.add(dto);
                artistSet.add(dto);
            }

            musicDtos.add(
                MusicImageDto.builder().id(music.getId()).name(music.getName()).artists(artistDtos)
                    .duration(music.getDuration() / 60 + "분 " + music.getDuration() % 60 + "초")
                    .build());
        }

        int[] durations = calculateDuration(duration);

        String totalDuration = durations[0] == 0 ? durations[1] + "분 " + durations[2] + "초"
            : durations[0] + "시간 " + durations[1] + "분";

        result.setTotalDuration(totalDuration);
        result.setMusics(musicDtos);
        result.setArtists(artistSet.stream().toList());

        return result;
    }

    // 아티스트 상세 정보 조회
    @Override
    public ArtistDetailDto getArtistDetail(Long artistId) {
        Artist artist = artistRepository.findById(artistId).orElse(null);

        if (artist == null) {
            return new ArtistDetailDto();
        }

        List<Album> albums = albumRepository.getDiscographyByArtist(artistId);
        List<DiscographyAlbumDto> discography = new ArrayList<>();

        for (Album album : albums) {
            discography.add(DiscographyAlbumDto.builder().id(album.getId()).name(album.getName())
                .image(album.getImageName()).build());
        }

        List<Music> musics = musicRepository.getPopularByArtist(artistId, Pageable.ofSize(5));
        List<PopularMusicDto> popular = new ArrayList<>();

        for (Music music : musics) {
            int[] durations = calculateDuration(music.getDuration());

            popular.add(PopularMusicDto.builder().id(music.getId()).musicName(music.getName())
                .musicDuration(durations[0] == 0 ? durations[1] + ":" + durations[2]
                    : durations[0] + ":" + durations[1] + ":" + durations[2]).build());
        }

        return ArtistDetailDto.builder().name(artist.getName()).image(artist.getImageName())
            .discography(discography).popular(popular).build();
    }

    // 음악 상세 정보 조회
    @Override
    public MusicDetailDto getMusicDetail(Long musicId) {
        MusicDetailDto result = new MusicDetailDto();

        Music music = musicRepository.findById(musicId).orElse(null);

        if (music == null) {
            return new MusicDetailDto();
        }

        result.setMusicId(music.getId());
        result.setMusicName(music.getName());
        result.setAlbumId(music.getAlbum().getId());
        result.setAlbumName(music.getAlbum().getName());
        result.setAlbumImage(music.getAlbum().getImageName());
        result.setGenre(music.getGenre().getName());

        int duration = music.getDuration();
        int[] durations = calculateDuration(duration);
        result.setDuration(durations[0] == 0 ? durations[1] + ":" + durations[2]
            : durations[0] + ":" + durations[1] + ":" + durations[2]);
        result.setReleaseDate(music.getAlbum().getReleaseDate().toString());

        List<Artist> artistList = artistMusicRepository.findAllByMusic(music);
        List<MusicDetailArtistDto> artistDtos = new ArrayList<>();

        for (Artist artist : artistList) {
            MusicDetailArtistDto dto = new MusicDetailArtistDto();
            dto.setId(artist.getId());
            dto.setName(artist.getName());
            artistDtos.add(dto);
        }

        result.setArtists(artistDtos);

        return result;
    }

    public int[] calculateDuration(int duration) {
        return new int[]{duration / 3600, duration % 3600 / 60, duration % 60};
    }

}
