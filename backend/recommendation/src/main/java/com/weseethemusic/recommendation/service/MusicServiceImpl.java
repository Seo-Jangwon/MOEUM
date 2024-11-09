package com.weseethemusic.recommendation.service;

import com.weseethemusic.common.dto.MusicDto;
import com.weseethemusic.recommendation.common.entity.Genre;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.repository.GenreRepository;
import com.weseethemusic.recommendation.repository.MusicRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MusicServiceImpl implements MusicService {

    private final MusicRepository musicRepository;
    private final GenreRepository genreRepository;

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

        // 음악 엔티티 생성 및 저장
        Music music = new Music();
        music.setId(musicDto.getId());
        music.setName(musicDto.getName());
        music.setGenre(genre);
        music.setDuration(musicDto.getDuration());
        music.setDanceability(musicDto.getDanceability());
        music.setLoudness(musicDto.getLoudness());
        music.setMode(musicDto.isMode());
        music.setSpeechiness(musicDto.getSpeechiness());
        music.setAcousticness(musicDto.getAcousticness());
        music.setValence(musicDto.getValence());
        music.setTempo(musicDto.getTempo());
        music.setEnergy(musicDto.getEnergy());

        musicRepository.save(music);
        log.info("음악 저장 성공: {}", music.getId());
    }
}
