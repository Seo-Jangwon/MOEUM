package com.weseethemusic.gateway.component;


import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

/**
 * 서비스 헬스체크 수행하는 클래스 각 서비스의 actuator/health 엔드포인트 호출하여 상태 확인
 */
@Component
@Slf4j
public class ServiceHealthIndicator implements HealthIndicator {

    private final WebClient webClient;
    private final Map<String, String> services = new HashMap<>();

    public ServiceHealthIndicator(WebClient webClient) {
        this.webClient = webClient;
    }


    @Value("${service.url.member}")
    public void setMemberServiceUrl(String url) {
        services.put("member-service", url);
    }

    @Value("${service.url.music}")
    public void setMusicServiceUrl(String url) {
        services.put("music-service", url);
    }

    @Value("${service.url.player}")
    public void setPlayerServiceUrl(String url) {
        services.put("player-service", url);
    }

    @Value("${service.url.history}")
    public void setHistoryServiceUrl(String url) {
        services.put("history-service", url);
    }

    @Value("${service.url.settings}")
    public void setSettingsServiceUrl(String url) {
        services.put("settings-service", url);
    }

    @Value("${service.url.recommendations}")
    public void setRecommendationsServiceUrl(String url) {
        services.put("recommendations-service", url);
    }

    @Override
    public Health health() {
        Map<String, Health> healthResults = new HashMap<>();

        services.forEach((serviceName, baseUrl) -> {
            try {
                Health serviceHealth = checkServiceHealth(baseUrl + "/actuator/health");
                healthResults.put(serviceName, serviceHealth);
                log.info("Service {} health check result: {}", serviceName,
                    serviceHealth.getStatus());
            } catch (Exception e) {
                log.warn("Service {} health check failed", serviceName, e);
                healthResults.put(serviceName, Health.down(e).build());
            }
        });

        // 모든 서비스가 UP 상태인지 확인
        boolean allUp = healthResults.values().stream()
            .allMatch(health -> Status.UP.equals(health.getStatus()));

        return allUp ?
            Health.up().withDetails(healthResults).build() :
            Health.down().withDetails(healthResults).build();
    }

    private Health checkServiceHealth(String healthUrl) {
        try {
            webClient.get()
                .uri(healthUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(3));

            return Health.up().build();
        } catch (Exception e) {
            log.warn("URL: {}에 대한 헬스체크 실패", healthUrl, e);
            return Health.down(e).build();
        }
    }
}