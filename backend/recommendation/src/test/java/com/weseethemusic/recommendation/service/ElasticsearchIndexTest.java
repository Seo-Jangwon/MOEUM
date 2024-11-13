package com.weseethemusic.recommendation.service;

import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.common.service.elasticsearch.MusicIndexService;
import com.weseethemusic.recommendation.repository.MusicRepository;
import io.jsonwebtoken.io.IOException;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ElasticsearchIndexTest {

    @Autowired
    private MusicIndexService musicIndexService;

    @Autowired
    private MusicRepository musicRepository;

    @Test
    void 음악_데이터_인덱싱() throws IOException, java.io.IOException {

        try {
            musicIndexService.deleteIndex();
        } catch (Exception e) {
            System.out.println("삭제할 인덱스 없음");
        }

        // 인덱스 생성
        musicIndexService.createIndex();

        // 모든 음악 데이터 가져오기
        List<Music> allMusic = musicRepository.findAllWithDetails();
        System.out.println("전체 음악 카운트: " + allMusic.size());

        // 데이터 인덱싱
        musicIndexService.indexMusic(allMusic);

        // 인덱싱 결과 출력
        System.out.println("인덱싱 완료");
    }
}
