package com.weseethemusic.music;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.data.web.config.PageableHandlerMethodArgumentResolverCustomizer;

@SpringBootApplication(scanBasePackages = "com.weseethemusic.music")
@EnableCaching
public class MusicApplication {

    @Bean
    public PageableHandlerMethodArgumentResolverCustomizer pageableHandlerMethodArgumentResolverCustomizer() {
        return customizer -> {
            customizer.setOneIndexedParameters(true);
        };
    }

    public static void main(String[] args) {
        SpringApplication.run(MusicApplication.class, args);
    }

}
