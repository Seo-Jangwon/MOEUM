package com.weseethemusic.recommendation.service.music;

import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.recommendation.common.entity.Album;
import com.weseethemusic.recommendation.common.entity.Artist;
import com.weseethemusic.recommendation.common.entity.Genre;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.common.service.elasticsearch.MusicIndexService;
import com.weseethemusic.recommendation.repository.AlbumRepository;
import com.weseethemusic.recommendation.repository.ArtistRepository;
import com.weseethemusic.recommendation.repository.GenreRepository;
import com.weseethemusic.recommendation.repository.MusicRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService {

    private final MusicIndexService musicIndexService;
    private final MusicRepository musicRepository;
    private final GenreRepository genreRepository;
    private final AlbumRepository albumRepository;
    private final ArtistRepository artistRepository;

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(Long musicId) {
        return musicRepository.findById(musicId).isPresent();
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createMusic(MusicDto musicDto) {

        // 이미 존재하는 음악인지
        if (musicRepository.findById(musicDto.getId()).isPresent()) {
            log.info("음악이 이미 존재함. id: {}", musicDto.getId());
            return;
        }

        // 장르 조회
        Genre genre = genreRepository.findById(musicDto.getGenreId())
            .orElseThrow(() -> new RuntimeException(
                String.format("장르가 존재하지 않음. id: %d", musicDto.getGenreId())
            ));

        Album album = albumRepository.findById(musicDto.getAlbumId())
            .orElseThrow(() -> new RuntimeException(
                String.format("앨범이 존재하지 않음. id: %d", musicDto.getAlbumId())
            ));

        // 음악 엔티티 생성 및 저장
        Music music = new Music();
        music.setId(musicDto.getId());
        music.setName(musicDto.getName());
        music.setGenre(genre);
        music.setAlbum(album);
        music.setDuration(musicDto.getDuration());
        music.setDanceability(musicDto.getDanceability());
        music.setLoudness(musicDto.getLoudness());
        music.setMode(musicDto.isMode());
        music.setSpeechiness(musicDto.getSpeechiness());
        music.setAcousticness(musicDto.getAcousticness());
        music.setValence(musicDto.getValence());
        music.setTempo(musicDto.getTempo());
        music.setEnergy(musicDto.getEnergy());

        // 아티스트 연결
        for (Long artistId : musicDto.getArtistIds()) {
            Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new RuntimeException(
                    String.format("아티스트가 존재하지 않음. id: %d", artistId)
                ));
            music.addArtist(artist);
        }

        musicRepository.save(music);
        log.info("음악 저장 성공: {}", music.getId());

        try {
            List<Music> musicList = musicRepository.findAll();
            musicIndexService.indexMusic(musicList);
        } catch (Exception e) {
            log.error("음악 인덱싱 불가 {}", e.getMessage());
        }
    }
}
