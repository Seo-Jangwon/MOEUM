package com.weseethemusic.music.service;

import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.dto.search.ArtistDto;
import com.weseethemusic.music.dto.search.MusicDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
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

    // 음악 모두 보기 검색
    @Override
    public List<MusicDto> searchAllMusics(String keyword, Pageable pageable) {
        List<MusicDto> result = new ArrayList<>();
        log.info("keyword, pageable: {}, {}", keyword, pageable);
        
        List<Music> musics = musicRepository.findAllByName(keyword, pageable);

        log.info("musics: {}", musics);

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

}
