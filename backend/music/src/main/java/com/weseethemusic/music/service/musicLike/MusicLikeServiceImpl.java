package com.weseethemusic.music.service.musicLike;

import com.weseethemusic.music.common.entity.Artist;
import com.weseethemusic.music.common.entity.LikeAlbum;
import com.weseethemusic.music.common.entity.LikeArtist;
import com.weseethemusic.music.common.entity.LikeMusic;
import com.weseethemusic.music.common.entity.Music;
import com.weseethemusic.music.dto.like.ArtistDto;
import com.weseethemusic.music.dto.like.MusicDto;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistMusicRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.LikeAlbumRepository;
import com.weseethemusic.music.repository.LikeArtistRepository;
import com.weseethemusic.music.repository.LikeMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
import com.weseethemusic.music.service.musicDetail.MusicDetailServiceImpl;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MusicLikeServiceImpl implements MusicLikeService {

    private final LikeMusicRepository likeMusicRepository;
    private final MusicRepository musicRepository;
    private final LikeAlbumRepository likeAlbumRepository;
    private final AlbumRepository albumRepository;
    private final LikeArtistRepository likeArtistRepository;
    private final ArtistRepository artistRepository;
    private final ArtistMusicRepository artistMusicRepository;

    private final MusicDetailServiceImpl musicDetailService;

    // 음악 좋아요 설정
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void likeMusic(Long memberId, Long musicId) {
        likeMusicRepository.save(LikeMusic.builder().memberId(memberId)
            .music(musicRepository.findById(musicId).orElseThrow()).build());
    }

    // 음악 좋아요 해제
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void unlikeMusic(Long memberId, Long musicId) {
        likeMusicRepository.deleteLikeMusicByMemberIdAndMusic_Id(memberId, musicId);
    }

    // 앨범 좋아요 설정
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void likeAlbum(Long memberId, Long albumId) {
        likeAlbumRepository.save(
            new LikeAlbum(memberId, albumRepository.findById(albumId).orElseThrow()));
    }

    // 앨범 좋아요 해제
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void unlikeAlbum(Long memberId, Long albumId) {
        likeAlbumRepository.deleteLikeAlbumByMemberIdAndAlbum_Id(memberId, albumId);
    }

    // 아티스트 좋아요 설정
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void likeArtist(Long memberId, Long artistId) {
        likeArtistRepository.save(
            new LikeArtist(memberId, artistRepository.findById(artistId).orElseThrow()));
    }

    // 아티스트 좋아요 해제
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void unlikeArtist(Long memberId, Long artistId) {
        likeArtistRepository.deleteByMemberIdAndArtist_Id(memberId, artistId);
    }

    // 좋아요 한 음악 목록 조회
    @Override
    public List<MusicDto> getMyLikeMusics(Long memberId) {
        List<MusicDto> result = new ArrayList<>();
        List<Music> musics = likeMusicRepository.getMyLikeMusics(memberId);

        for (Music music : musics) {
            List<ArtistDto> dtos = new ArrayList<>();
            List<Artist> artists = artistMusicRepository.findAllByMusic(music);

            for (Artist artist : artists) {
                dtos.add(new ArtistDto(artist.getId(), artist.getName()));
            }

            int[] durations = musicDetailService.calculateDuration(music.getDuration());

            result.add(MusicDto.builder().id(music.getId()).name(music.getName()).duration(
                    durations[0] == 0 ? durations[1] + ":" + durations[2]
                        : durations[0] + ":" + durations[1] + ":" + durations[2])
                .albumId(music.getAlbum().getId()).albumName(music.getAlbum().getName())
                .albumImage(music.getAlbum().getImageName()).artists(dtos).build());
        }

        return result;
    }

}
