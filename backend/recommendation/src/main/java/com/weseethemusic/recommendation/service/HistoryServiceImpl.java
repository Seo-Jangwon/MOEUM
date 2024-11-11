package com.weseethemusic.recommendation.service;

import com.weseethemusic.recommendation.common.entity.Artist;
import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.dto.history.ArtistDto;
import com.weseethemusic.recommendation.dto.history.MusicDto;
import com.weseethemusic.recommendation.repository.AlbumRepository;
import com.weseethemusic.recommendation.repository.ArtistMusicRepository;
import com.weseethemusic.recommendation.repository.HistoryRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistoryServiceImpl implements HistoryService {

    private final HistoryRepository historyRepository;
    private final ArtistMusicRepository artistMusicRepository;
    private final AlbumRepository albumRepository;

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

            result.add(MusicDto.builder().id(music.getId()).name(music.getName())
                .albumImage(albumRepository.getAlbumImage(music.getAlbum().getId()))
                .artists(artistDtos).build());
        }

        return result;
    }

    // 재생 기록 선택 삭제
    @Override
    public void deletePlayHistory(Long memberId, Long musicId) {
        historyRepository.deleteByMemberIdAndMusic_Id(memberId, musicId);
    }

}
