package com.weseethemusic.gateway.config;

import com.weseethemusic.gateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RouteConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public RouteConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        // JWT 필터 설정
        JwtAuthenticationFilter.Config authConfig = new JwtAuthenticationFilter.Config()
            .requireRefreshToken(true)
            .addExcludedPath("/members/register/token")
            .addExcludedPath("/members/register/check/token")
            .addExcludedPath("/members/register")
            .addExcludedPath("/members/login");

        return builder.routes()

            .route("auth-service", r -> r
                .path("/auth/**")  // 토큰 재발급
                .uri("http://localhost:8081"))

            // Member Service - Public Routes
            .route("member-service-public", r -> r
                .path("/members/register/token", "/members/register/check/token",
                    "/members/register", "/members/login")
                .uri("http://localhost:8082"))

            // Member Service - Protected Routes
            .route("member-service-protected", r -> r
                .path("/members/**")
                .and()
                .not(p -> p.path("/members/register/token", "/members/register/check/token",
                    "/members/register", "/members/login"))
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8082"))

            // Music Service Routes
            .route("music-playlist", r -> r
                .path("/musics/playlist/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            .route("music-search", r -> r
                .path("/musics/search")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            .route("music-detail", r -> r
                .path("/musics/detail/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            .route("music-like", r -> r
                .path("/musics/*/like")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            .route("music-artist", r -> r
                .path("/musics/artist/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            .route("music-recommend", r -> r
                .path("/musics/recommend", "/musics/popular", "/musics/latest")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            // Player Service Routes
            .route("player-service", r -> r
                .path("/player/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            // History Service Routes
            .route("history-service", r -> r
                .path("/history/**")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            // Settings Service Routes
            .route("settings-service", r -> r
                .path("/settings/**", "/setting")
                .filters(f -> f
                    .filter(jwtAuthenticationFilter.apply(authConfig))
                    .rewritePath("/setting", "/settings"))
                .uri("http://localhost:8080"))

            // Recommendations Service Routes
            .route("recommendations-service", r -> r
                .path("/recommendations")
                .filters(f -> f.filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri("http://localhost:8080"))

            .build();
    }
}