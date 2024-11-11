package com.weseethemusic.music.common.config;

import com.weseethemusic.music.common.listner.AlbumEntityListener;
import com.weseethemusic.music.common.listner.ArtistEntityListener;
import com.weseethemusic.music.common.listner.GenreEntityListener;
import com.weseethemusic.music.common.listner.MusicEntityListener;
import com.weseethemusic.music.common.publisher.MusicEventPublisher;
import com.weseethemusic.music.common.service.SyncSagaService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EntityListenerConfig {

    @Bean
    public GenreEntityListener genreEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        return new GenreEntityListener(eventPublisher, syncSagaService);
    }

    @Bean
    public MusicEntityListener musicEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        return new MusicEntityListener(eventPublisher, syncSagaService);
    }

    @Bean
    public AlbumEntityListener AlbumEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        return new AlbumEntityListener(eventPublisher, syncSagaService);
    }

    @Bean
    public ArtistEntityListener ArtistEntityListener(MusicEventPublisher eventPublisher,
        SyncSagaService syncSagaService) {
        return new ArtistEntityListener(eventPublisher, syncSagaService);
    }
}
