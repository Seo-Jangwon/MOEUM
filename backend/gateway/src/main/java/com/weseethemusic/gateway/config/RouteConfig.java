package com.weseethemusic.gateway.config;

import com.weseethemusic.gateway.constants.SecurityConstants;
import com.weseethemusic.gateway.filter.JwtAuthenticationFilter;
import com.weseethemusic.gateway.filter.RequestLoggingFilter;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.web.server.ServerWebExchange;

@Configuration
public class RouteConfig {

    @Value("${service.url.member}")
    private String memberServiceUrl;

    @Value("${service.url.music}")
    private String musicServiceUrl;

    @Value("${service.url.recommendations}")
    private String recommendationsServiceUrl;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RequestLoggingFilter requestLoggingFilter;

    public RouteConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
        RequestLoggingFilter requestLoggingFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.requestLoggingFilter = requestLoggingFilter;
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
            .addExcludedPath("/members/login")
            .addExcludedPath("/musics/search")
            .addExcludedPath("/musics/detail/music/*")
            .addExcludedPath("/musics/artist/*/discography")
            .addExcludedPath("/musics/recommend")
            .addExcludedPath("/musics/popular")
            .addExcludedPath("/musics/popular/playlist")
            .addExcludedPath("/musics/visualization/*")
            .addExcludedPath("/musics/latest")
            .addExcludedPath("/musics/detail/album/*")
            .addExcludedPath("/musics/detail/artist/*")
            .addExcludedPath("/members/token");

        return builder.routes()
            // 멤버 서비스 공개 경로
            .route("member-service-public", r -> r
                .path("/members/register/token", "/members/register/check/token",
                    "/members/register", "/members/login")
                .filters(f -> f.filter(requestLoggingFilter.apply(new Object())))
                .uri(memberServiceUrl))

            // 멤버 서비스 토큰 재발급 경로 (인증 없이)
            .route("member-token-refresh", r -> r
                .path("/members/token")
                .filters(f -> f
                    .filter(requestLoggingFilter.apply(new Object()))
                    // Refresh Token을 헤더에 추가하는 커스텀 필터
                    .filter((exchange, chain) -> {
                        ServerHttpRequest request = exchange.getRequest();
                        String refreshToken = getRefreshTokenFromCookies(exchange);
                        String token = exchange.getRequest().getHeaders()
                            .getFirst(SecurityConstants.JWT_HEADER);

                        if (refreshToken != null) {
                            // ServerHttpRequestDecorator 사용하여 헤더 수정
                            ServerHttpRequest modifiedRequest = new ServerHttpRequestDecorator(
                                request) {
                                @Override
                                public HttpHeaders getHeaders() {
                                    HttpHeaders headers = new HttpHeaders();
                                    super.getHeaders().forEach(
                                        (key, values) -> headers.put(key, new ArrayList<>(values)));
                                    headers.remove(SecurityConstants.JWT_HEADER);
                                    headers.add(SecurityConstants.REFRESH_TOKEN_HEADER,
                                        refreshToken);
                                    headers.add(SecurityConstants.JWT_HEADER, token);
                                    return headers;
                                }
                            };

                            // 수정된 요청으로 새로운 exchange 생성
                            ServerWebExchange modifiedExchange = exchange.mutate()
                                .request(modifiedRequest)
                                .build();

                            return chain.filter(modifiedExchange);

                        }

                        return chain.filter(exchange);
                    })
                )
                // JWT 인증 필터는 제외됨
                .uri(memberServiceUrl))

            .route("member-service-protected", r -> r
                .path("/members/**", "/settings/**")
                .and()
                .not(p -> p.path("/members/register/token", "/members/register/check/token",
                    "/members/register", "/members/login"))
                .filters(f -> f
                    .filter(requestLoggingFilter.apply(new Object()))
                    .filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri(memberServiceUrl))

            // 뮤직 서비스 공개 경로
            .route("music-service-public", r -> r
                .path("/musics/search/**", "/musics/detail/music/*",
                    "/musics/artist/*/discography",
                    "/musics/popular", "/musics/popular/playlist", "/musics/recommend",
                    "/musics/latest",
                    "/musics/detail/album/*",
                    "/musics/detail/artist/*", "/musics/visualization/*")
                .filters(f -> f
                    .filter(requestLoggingFilter.apply(new Object()))
                    .circuitBreaker(config -> config
                        .setName("music-service")
                        .setFallbackUri("/fallback/music"))
                    .retry(3))
                .uri(musicServiceUrl))

            // 뮤직 서비스 인증 경로
            .route("music-service-protected", r -> r
                .path("/musics/**", "/player/**")
                .and()
                .not(p -> p.path("/musics/search/**", "/musics/detail/music/*",
                    "/musics/artist/*/discography",
                    "/musics/popular", "/musics/popular/playlist", "/musics/recommend",
                    "/musics/latest",
                    "/musics/detail/album/*",
                    "/musics/detail/artist/*", "/musics/visualization/*"))
                .filters(f -> f
                    .filter(requestLoggingFilter.apply(new Object()))
                    .filter(jwtAuthenticationFilter.apply(authConfig))
                    .circuitBreaker(config -> config
                        .setName("music-service")
                        .setFallbackUri("/fallback/music"))
                    .retry(3))
                .uri(musicServiceUrl))

            // 추천 서비스 경로(인증 필요)
            .route("recommendations-service", r -> r
                .path("/recommendations/**")
                .filters(f -> f
                    .filter(requestLoggingFilter.apply(new Object()))
                    .filter(jwtAuthenticationFilter.apply(authConfig)))
                .uri(recommendationsServiceUrl))

            .build();
    }

    private String getRefreshTokenFromCookies(ServerWebExchange exchange) {
        if (exchange.getRequest().getCookies()
            .containsKey(SecurityConstants.REFRESH_TOKEN_COOKIE)) {
            return exchange.getRequest().getCookies()
                .getFirst(SecurityConstants.REFRESH_TOKEN_COOKIE).getValue();
        }
        return null;
    }
}