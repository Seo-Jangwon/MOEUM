package com.weseethemusic.music.service;

import com.weseethemusic.music.common.entity.LikeMusic;
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

}
