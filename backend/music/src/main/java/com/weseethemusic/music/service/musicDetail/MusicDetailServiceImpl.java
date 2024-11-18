package com.weseethemusic.music.service.musicDetail;

import com.weseethemusic.music.common.entity.Album;
import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.dto.detail.*;
import com.weseethemusic.music.dto.search.ArtistImageDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.LikeAlbumRepository;
import com.weseethemusic.music.repository.LikeArtistRepository;
import com.weseethemusic.music.repository.LikeMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MusicDetailServiceImpl implements MusicDetailService {

    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;
    private final MusicRepository musicRepository;
    private final ArtistMusicRepository artistMusicRepository;
    private final LikeMusicRepository likeMusicRepository;
    private final LikeAlbumRepository likeAlbumRepository;
    private final LikeArtistRepository likeArtistRepository;


    // 앨범 상세 정보 조회
    @Override
    @Transactional(readOnly = true)
    public AlbumDetailDto getAlbumDetail(Long albumId, Long memberId) {
        Album album = albumRepository.findById(albumId).orElse(null);

        if (album == null) {
            return new AlbumDetailDto();
        }

        boolean isLike = false;
        if (memberId != null) {
            isLike = likeAlbumRepository.existsByMemberIdAndAlbum_Id(memberId, albumId);
        }

        AlbumDetailDto result = AlbumDetailDto.builder()
            .id(album.getId())
            .name(album.getName())
            .releaseDate(album.getReleaseDate().toString())
            .image(album.getImageName())
            .isLike(isLike)
            .build();

        int duration = 0;
        List<Music> musics = musicRepository.findAllByAlbum_Id(albumId);
        List<MusicImageDto> musicDtos = new ArrayList<>();
        Set<ArtistImageDto> artistSet = new HashSet<>();

        for (Music music : musics) {
            duration += music.getDuration();

            List<Artist> artistList = artistMusicRepository.findAllByMusic(music);
            List<ArtistImageDto> artistDtos = new ArrayList<>();

            boolean musicIsLike = false;
            if (memberId != null) {
                musicIsLike = likeMusicRepository.existsByMemberIdAndMusic_Id(memberId,
                    music.getId());
            }

            for (Artist artist : artistList) {
                boolean artistIsLike = false;
                if (memberId != null) {
                    artistIsLike = likeArtistRepository.existsByMemberIdAndArtist_Id(memberId,
                        artist.getId());
                }

                ArtistImageDto dto = ArtistImageDto.builder()
                    .id(artist.getId())
                    .name(artist.getName())
                    .image(artist.getImageName())
                    .isLike(artistIsLike)
                    .build();

                artistDtos.add(dto);
                artistSet.add(dto);
            }

            musicDtos.add(MusicImageDto.builder()
                .id(music.getId())
                .name(music.getName())
                .artists(artistDtos)
                .duration(music.getDuration() / 60 + "분 " + music.getDuration() % 60 + "초")
                .isLike(musicIsLike)
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
    @Transactional(readOnly = true)
    public ArtistDetailDto getArtistDetail(Long artistId, Long memberId) {
        Artist artist = artistRepository.findById(artistId).orElse(null);

        if (artist == null) {
            return new ArtistDetailDto();
        }

        boolean isLike = false;
        if (memberId != null) {
            isLike = likeArtistRepository.existsByMemberIdAndArtist_Id(memberId, artistId);
        }

        List<Album> albums = albumRepository.getDiscographyByArtist(artistId);
        List<DiscographyAlbumDto> discography = new ArrayList<>();

        for (Album album : albums) {
            boolean albumIsLike = false;
            if (memberId != null) {
                albumIsLike = likeAlbumRepository.existsByMemberIdAndAlbum_Id(memberId,
                    album.getId());
            }

            discography.add(DiscographyAlbumDto.builder()
                .id(album.getId())
                .name(album.getName())
                .image(album.getImageName())
                .isLike(albumIsLike)
                .build());
        }

        List<Music> musics = musicRepository.getPopularByArtist(artistId, Pageable.ofSize(5));
        List<PopularMusicDto> popular = new ArrayList<>();

        for (Music music : musics) {
            int[] durations = calculateDuration(music.getDuration());

            boolean musicIsLike = false;
            if (memberId != null) {
                musicIsLike = likeMusicRepository.existsByMemberIdAndMusic_Id(memberId,
                    music.getId());
            }

            popular.add(PopularMusicDto.builder()
                .id(music.getId())
                .musicName(music.getName())
                .musicDuration(durations[0] == 0 ? durations[1] + ":" + durations[2]
                    : durations[0] + ":" + durations[1] + ":" + durations[2])
                .isLike(musicIsLike)
                .build());
        }

        return ArtistDetailDto.builder()
            .name(artist.getName())
            .image(artist.getImageName())
            .discography(discography)
            .popular(popular)
            .isLike(isLike)
            .build();
    }

    // 음악 상세 정보 조회
    @Override
    @Transactional(readOnly = true)
    public MusicDetailDto getMusicDetail(Long musicId, Long memberId) {
        MusicDetailDto result = new MusicDetailDto();

        Music music = musicRepository.findById(musicId).orElse(null);

        if (music == null) {
            return new MusicDetailDto();
        }

        boolean musicIsLike = false;
        boolean albumIsLike = false;
        if (memberId != null) {
            musicIsLike = likeMusicRepository.existsByMemberIdAndMusic_Id(memberId, music.getId());
            albumIsLike = likeAlbumRepository.existsByMemberIdAndAlbum_Id(memberId,
                music.getAlbum().getId());
        }

        result.setMusicId(music.getId());
        result.setMusicName(music.getName());
        result.setAlbumId(music.getAlbum().getId());
        result.setAlbumName(music.getAlbum().getName());
        result.setAlbumImage(music.getAlbum().getImageName());
        result.setGenre(music.getGenre().getName());
        result.setMusicIsLike(musicIsLike);
        result.setAlbumIsLike(albumIsLike);

        int duration = music.getDuration();
        int[] durations = calculateDuration(duration);
        result.setDuration(durations[0] == 0 ? durations[1] + ":" + durations[2]
            : durations[0] + ":" + durations[1] + ":" + durations[2]);
        result.setReleaseDate(music.getAlbum().getReleaseDate().toString());

        List<Artist> artistList = artistMusicRepository.findAllByMusic(music);
        List<MusicDetailArtistDto> artistDtos = new ArrayList<>();

        for (Artist artist : artistList) {
            boolean artistIsLike = false;
            if (memberId != null) {
                artistIsLike = likeArtistRepository.existsByMemberIdAndArtist_Id(memberId,
                    artist.getId());
            }

            MusicDetailArtistDto dto = new MusicDetailArtistDto();
            dto.setId(artist.getId());
            dto.setName(artist.getName());
            dto.setIsLike(artistIsLike);
            artistDtos.add(dto);
        }

        result.setArtists(artistDtos);

        return result;
    }

    public int[] calculateDuration(int duration) {
        return new int[]{duration / 3600, duration % 3600 / 60, duration % 60};
    }
}
