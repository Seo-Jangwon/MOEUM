package com.weseethemusic.gateway.config;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
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
    public HealthIndicator serviceHealthIndicator(WebClient.Builder webClientBuilder) {
        return new ServiceHealthIndicator(webClientBuilder.build());
    }

    /**
     * 서비스 헬스체크 수행하는 내부 클래스 각 서비스의 actuator/health 엔드포인트 호출하여 상태 확인
     */
    @Component
    @Slf4j
    public static class ServiceHealthIndicator implements HealthIndicator {

        private final WebClient webClient;

        public ServiceHealthIndicator(WebClient webClient) {
            this.webClient = webClient;
        }

        /**
         * 각 서비스의 헬스체크
         *
         * @return 전체 서비스의 상태 정보 담은 health 객체
         */
        @Override
        public Health health() {
            Map<String, Health> services = new HashMap<>();

            // Auth 서비스 헬스체크
            services.put("auth-service",
                checkServiceHealth("http://localhost:8081/actuator/health"));

            // Member 서비스 헬스체크
            services.put("member-service",
                checkServiceHealth("http://localhost:8082/actuator/health"));

            // Music 서비스 헬스체크
            services.put("music-service",
                checkServiceHealth("http://localhost:8080/actuator/health"));

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
}