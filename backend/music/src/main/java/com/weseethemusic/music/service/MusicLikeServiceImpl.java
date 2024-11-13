package com.weseethemusic.music.service;

import com.weseethemusic.music.common.entity.LikeAlbum;
import com.weseethemusic.music.common.entity.LikeArtist;
import com.weseethemusic.music.common.entity.LikeMusic;
import com.weseethemusic.music.repository.AlbumRepository;
import com.weseethemusic.music.repository.ArtistRepository;
import com.weseethemusic.music.repository.LikeAlbumRepository;
import com.weseethemusic.music.repository.LikeArtistRepository;
import com.weseethemusic.music.repository.LikeMusicRepository;
import com.weseethemusic.music.repository.MusicRepository;
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

}
