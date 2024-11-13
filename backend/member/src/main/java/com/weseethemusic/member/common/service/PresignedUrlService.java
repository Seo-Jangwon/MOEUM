package com.weseethemusic.member.common.service;

import java.time.Duration;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PresignedUrlService {

    private final S3Service s3Service;
    private final RedisTemplate<String, Object> redisTemplate;

    @Cacheable(value = "image", key = "#objectKey", unless = "#result == null") // 2시간
    public String getPresignedUrl(String objectKey) {
        return s3Service.generatePresignedUrl(objectKey);
    }
}