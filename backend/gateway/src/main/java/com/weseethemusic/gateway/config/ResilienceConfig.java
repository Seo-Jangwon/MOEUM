package com.weseethemusic.gateway.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import org.springframework.cloud.circuitbreaker.resilience4j.ReactiveResilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
@Slf4j
public class ResilienceConfig {

    @Bean
    public Customizer<ReactiveResilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
            .circuitBreakerConfig(CircuitBreakerConfig.custom()
                .slidingWindowSize(10) // 상태를 결정하는데 사용할 최근 호출 수
                .minimumNumberOfCalls(5) // Circuit Breaker가 작동하기 위한 최소 호출 수
                .permittedNumberOfCallsInHalfOpenState(3) // Half-Open 상태에서 허용할 호출 수
                .waitDurationInOpenState(Duration.ofSeconds(5)) // Circuit이 Open 상태를 유지하는 시간
                .failureRateThreshold(50.0f) // Circuit을 Open 상태로 전환하는 실패율 임계값(%)
                .build())
            .build());
    }

    /**
     * 각 서비스의 헬스체크 수행하는 컴포넌트 생성
     */
    @Bean
    public HealthIndicator serviceHealthIndicator(
        WebClient.Builder webClientBuilder,
        @Value("${service.url.member}") String memberServiceUrl,
        @Value("${service.url.music}") String musicServiceUrl,
        @Value("${service.url.player}") String playerServiceUrl,
        @Value("${service.url.history}") String historyServiceUrl,
        @Value("${service.url.settings}") String settingsServiceUrl,
        @Value("${service.url.recommendations}") String recommendationsServiceUrl) {

        return new ServiceHealthIndicator(
            webClientBuilder.build(),
            memberServiceUrl,
            musicServiceUrl,
            playerServiceUrl,
            historyServiceUrl,
            settingsServiceUrl,
            recommendationsServiceUrl
        );
    }
}

/**
 * 서비스 헬스체크 수행하는 클래스 각 서비스의 actuator/health 엔드포인트 호출하여 상태 확인
 */
@Component
@Slf4j
class ServiceHealthIndicator implements HealthIndicator {

    private final WebClient webClient;
    private final String memberServiceUrl;
    private final String musicServiceUrl;
    private final String playerServiceUrl;
    private final String historyServiceUrl;
    private final String settingsServiceUrl;
    private final String recommendationsServiceUrl;

    public ServiceHealthIndicator(
        WebClient webClient,
        @Value("${service.url.member}") String memberServiceUrl,
        @Value("${service.url.music}") String musicServiceUrl,
        @Value("${service.url.player}") String playerServiceUrl,
        @Value("${service.url.history}") String historyServiceUrl,
        @Value("${service.url.settings}") String settingsServiceUrl,
        @Value("${service.url.recommendations}") String recommendationsServiceUrl) {
        this.webClient = webClient;
        this.memberServiceUrl = memberServiceUrl;
        this.musicServiceUrl = musicServiceUrl;
        this.playerServiceUrl = playerServiceUrl;
        this.historyServiceUrl = historyServiceUrl;
        this.settingsServiceUrl = settingsServiceUrl;
        this.recommendationsServiceUrl = recommendationsServiceUrl;
    }

    /**
     * 각 서비스의 헬스체크
     *
     * @return 전체 서비스의 상태 정보 담은 health 객체
     */
    @Override
    public Health health() {
        Map<String, Health> services = new HashMap<>();

        // Member 서비스 헬스체크
        services.put("member-service",
            checkServiceHealth(memberServiceUrl + "/actuator/health"));

        // Music 서비스 헬스체크
        services.put("music-service",
            checkServiceHealth(musicServiceUrl + "/actuator/health"));

        // Player 서비스 헬스체크
        services.put("player-service",
            checkServiceHealth(playerServiceUrl + "/actuator/health"));

        // History 서비스 헬스체크
        services.put("history-service",
            checkServiceHealth(historyServiceUrl + "/actuator/health"));

        // Settings 서비스 헬스체크
        services.put("settings-service",
            checkServiceHealth(settingsServiceUrl + "/actuator/health"));

        // Recommendations 서비스 헬스체크
        services.put("recommendations-service",
            checkServiceHealth(recommendationsServiceUrl + "/actuator/health"));

        // 모든 서비스가 UP 상태인지
        boolean allUp = services.values().stream()
            .allMatch(health -> health.getStatus().equals(Status.UP));

        return allUp ? Health.up().withDetails(services).build()
            : Health.down().withDetails(services).build();
    }

    /**
     * 개별 서비스 헬스체크 수행
     *
     * @param healthUrl 헬스체크 URL
     * @return 해당 서비스의 상태
     */
    private Health checkServiceHealth(String healthUrl) {
        try {
            webClient.get()
                .uri(healthUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(3)); // 3초 타임아웃

            return Health.up().build();
        } catch (Exception e) {
            log.warn("URL: {}에 대한 헬스체크 실패", healthUrl, e);
            return Health.down(e).build();
        }
    }
}