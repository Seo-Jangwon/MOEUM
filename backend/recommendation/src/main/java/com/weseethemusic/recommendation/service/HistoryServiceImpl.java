package com.weseethemusic.recommendation.service;

import com.weseethemusic.recommendation.common.entity.Artist;
import com.weseethemusic.recommendation.common.entity.History;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.dto.history.ArtistDto;
import com.weseethemusic.recommendation.dto.history.MusicDto;
import com.weseethemusic.recommendation.repository.AlbumRepository;
import com.weseethemusic.recommendation.repository.ArtistMusicRepository;
import com.weseethemusic.recommendation.repository.HistoryRepository;
import com.weseethemusic.recommendation.repository.MusicRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final HistoryRepository historyRepository;
    private final ArtistMusicRepository artistMusicRepository;
    private final AlbumRepository albumRepository;
    private final MusicRepository musicRepository;

    // 음악 재생 기록 조회
    @Override
    public List<MusicDto> getPlayHistory(Long memberId) {
        List<MusicDto> result = new ArrayList<>();
        List<Music> musics = historyRepository.findAllByMemberId(memberId);

        for (Music music : musics) {
            List<ArtistDto> artistDtos = new ArrayList<>();
            List<Artist> artists = artistMusicRepository.findAllByMusic(music);

            for (Artist artist : artists) {
                artistDtos.add(
                    ArtistDto.builder().id(artist.getId()).name(artist.getName()).build());
            }

            int duration = music.getDuration();
            int hours = duration / 3600;
            int minutes = duration % 3600 / 60;
            int seconds = duration % 60;

            result.add(MusicDto.builder().id(music.getId()).name(music.getName())
                .albumImage(albumRepository.getAlbumImage(music.getAlbum().getId())).duration(
                    hours == 0 ? minutes + ":" + seconds : hours + ":" + minutes + ":" + seconds)
                .artists(artistDtos).build());
        }

        return result;
    }

    // 재생 기록 선택 삭제
    @Override
    public void deletePlayHistory(Long memberId, Long musicId) {
        historyRepository.deleteByMemberIdAndMusic_Id(memberId, musicId);
    }

    // 재생 기록 추가
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void addPlayHistory(Long memberId, Long musicId) {
        historyRepository.save(History.builder().memberId(memberId)
            .music(musicRepository.findById(musicId).orElseThrow()).build());
    }

}
