package com.weseethemusic.music.service;

import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.dto.detail.ArtistDto;
import com.weseethemusic.music.dto.general.GeneralMusicDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.LikeMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService {

    private final LikeMusicRepository likeMusicRepository;
    private final ArtistMusicRepository artistMusicRepository;
    private final AlbumRepository albumRepository;
    private final MusicRepository musicRepository;

    // 인기 30곡 조회
    @Override
    public List<GeneralMusicDto> getPopularMusics() {
        return toMusicDto(likeMusicRepository.getPopularMusics());
    }

    // 최신 발매곡 조회
    @Override
    public List<GeneralMusicDto> getLatestMusics() {
        return toMusicDto(musicRepository.getLatestMusics());
    }

    private List<GeneralMusicDto> toMusicDto(List<Music> musics) {
        List<GeneralMusicDto> result = new ArrayList<>();

        for (Music music : musics) {
            List<Artist> artists = artistMusicRepository.findAllByMusic(music);
            List<ArtistDto> artistDtos = new ArrayList<>();

            for (Artist artist : artists) {
                artistDtos.add(
                    ArtistDto.builder().id(artist.getId()).name(artist.getName()).build());
            }

            result.add(GeneralMusicDto.builder().id(music.getId()).name(music.getName())
                .artists(artistDtos).image(albumRepository.getAlbumImage(music.getAlbum().getId()))
                .build());
        }

        return result;
    }

}
