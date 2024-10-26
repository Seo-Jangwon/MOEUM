package com.weseethemusic.gateway.filter;

import com.weseethemusic.gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().value();

            // 제외 경로 체크
            if (config.getExcludedPaths().contains(path)) {
                return chain.filter(exchange);
            }

            String token = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            // 토큰이 없는 경우
            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            token = jwtUtil.extractToken(token);

            try {
                // 토큰 기본 검증
                Claims claims = jwtUtil.validateToken(token);

                // 만료된 경우 Auth 서비스로 리다이렉트
                if (jwtUtil.isTokenExpired(claims)) {
                    return chain.filter(exchange.mutate()
                        .request(exchange.getRequest().mutate()
                            .path("/auth/refresh")
                            .build())
                        .build());
                }

                // 유효한 경우 원래 서비스로 전달
                return chain.filter(exchange);

            } catch (Exception e) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        };
    }


    @Getter
    @Setter
    public static class Config {
        private boolean requireRefreshToken = true;
        private List<String> excludedPaths = new ArrayList<>();

        public Config requireRefreshToken(boolean require) {
            this.requireRefreshToken = require;
            return this;
        }

        public Config addExcludedPath(String path) {
            this.excludedPaths.add(path);
            return this;
        }
    }
}