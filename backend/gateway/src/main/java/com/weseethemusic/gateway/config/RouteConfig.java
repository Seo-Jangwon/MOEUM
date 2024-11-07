package com.weseethemusic.gateway.config;

import com.weseethemusic.gateway.constants.SecurityConstants;
import com.weseethemusic.gateway.filter.JwtAuthenticationFilter;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpCookie;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.util.MultiValueMap;
import reactor.core.publisher.Mono;

@Configuration
public class RouteConfig {

    @Value("${service.url.member}")
    private String memberServiceUrl;

    @Value("${service.url.music}")
    private String musicServiceUrl;

    @Value("${service.url.player}")
    private String playerServiceUrl;

    @Value("${service.url.history}")
    private String historyServiceUrl;

    @Value("${service.url.settings}")
    private String settingsServiceUrl;

    @Value("${service.url.recommendations}")
    private String recommendationsServiceUrl;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public RouteConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    /**
     * 게이트웨이 라우팅 설정 정의 각 서비스별 라우트 구성, 필터 적용
     */
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        // JWT 인증 필요없는 공개 경로
        JwtAuthenticationFilter.Config authConfig = new JwtAuthenticationFilter.Config()
            .addExcludedPath("/members/register/token")
            .addExcludedPath("/members/register/check/token")
            .addExcludedPath("/members/register")
            .addExcludedPath("/members/login");

        return builder.routes()
            // Member Service Routes
            .route("member-service-public", r -> r
                .path("/members/register/token", "/members/register/check/token",
                    "/members/register", "/members/login")
                .uri(memberServiceUrl))

            .route("member-token-refresh", r -> r
                .path("/members/token")
                .filters(f -> f
                    .modifyRequestBody(String.class, String.class,
                        (exchange, body) -> {
                            ServerHttpRequest request = exchange.getRequest();
                            MultiValueMap<String, HttpCookie> cookies = request.getCookies();
                            List<HttpCookie> refreshTokenCookies = cookies.get(
                                SecurityConstants.REFRESH_TOKEN_COOKIE);

                            if (refreshTokenCookies != null && !refreshTokenCookies.isEmpty()) {
                                String refreshToken = refreshTokenCookies.get(0).getValue();
                                exchange.getRequest().mutate()
                                    .header(SecurityConstants.REFRESH_TOKEN_HEADER, refreshToken)
                                    .build();
                            }
                            return Mono.just(body);
                        }))
                .uri(memberServiceUrl))

            .route("member-service-protected", r -> r
                .path("/members/**", "/settings/**")
                .and()
                .not(p -> p.path("/members/register/token", "/members/register/check/token",
                    "/members/register", "/members/login"))
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri(memberServiceUrl))

            // Music Service Routes
            .route("music-service", r -> r
                .path("/musics/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig))
                    .circuitBreaker(config -> config
                        .setName("music-service")
                        .setFallbackUri("/fallback/music"))
                    .retry(3))
                .uri(musicServiceUrl))

            // Recommendations Service Routes
            .route("recommendations-service", r -> r
                .path("/recommend/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri(recommendationsServiceUrl))

            .build();
    }
}