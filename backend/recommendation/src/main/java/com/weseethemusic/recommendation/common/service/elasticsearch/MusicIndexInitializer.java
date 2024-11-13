package com.weseethemusic.recommendation.common.service.elasticsearch;

import com.weseethemusic.recommendation.common.entity.Music;
import com.weseethemusic.recommendation.repository.MusicRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MusicIndexInitializer {

    private final MusicRepository musicRepository;
    private final MusicIndexService musicIndexService;

    @Transactional
    @EventListener(ContextRefreshedEvent.class)
    public void initialize() {
        try {
            log.info("인덱스 초기화중...");

            musicIndexService.deleteIndex();
            musicIndexService.createIndex();

            List<Music> allMusic = musicRepository.findAll();

            if (allMusic.isEmpty()) {
                log.warn("음악이 존재하지 않음");
                return;
            }

            musicIndexService.indexMusic(allMusic);

            log.info("인덱싱 완료. 음악 {}개", allMusic.size());
        } catch (Exception e) {
            log.error("인덱싱 실패", e);
        }
    }
}
