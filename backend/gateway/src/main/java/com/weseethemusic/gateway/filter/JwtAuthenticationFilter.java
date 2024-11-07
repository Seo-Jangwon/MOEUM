package com.weseethemusic.gateway.filter;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.weseethemusic.gateway.constants.SecurityConstants;
import com.weseethemusic.gateway.util.JwtUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class JwtAuthenticationFilter extends
    AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String path = exchange.getRequest().getPath().value();
            log.debug("gateway - 입력 요청 경로: {}", path);

            // 제외 경로 체크
            if (config.getExcludedPaths().contains(path)) {
                log.debug("gateway - jwt 인증 제외: {}", path);
                return chain.filter(exchange);
            }

            String token = exchange.getRequest().getHeaders()
                .getFirst(SecurityConstants.JWT_HEADER);
            String refreshToken = exchange.getRequest().getHeaders()
                .getFirst(SecurityConstants.REFRESH_TOKEN_HEADER);

            // 토큰이 없는 경우
            if (token == null || !token.startsWith("Bearer ")) {
                log.warn("gateway - 토큰이 없거나 잘못된 형식입니다 : {}", path);
                return handleError(exchange, JwtUtil.TokenStatus.NOT_FOUND, "토큰이 없거나 잘못된 형식입니다");
            }

            String extractedToken = jwtUtil.extractToken(token);
            JwtUtil.TokenStatus status = jwtUtil.validateTokenStatus(extractedToken);
            log.debug("토큰 검증 결과: {}", status);

            switch (status) {
                case VALID:
                    String userId = jwtUtil.getUserIdFromToken(extractedToken);
                    String role = jwtUtil.getRoleFromToken(extractedToken);
                    log.info("gateway - 유저: {}에 대한 토큰 검증 완료", userId);
                    return chain.filter(exchange.mutate()
                        .request(exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("X-Role", role)
                            .build())
                        .build());

                case EXPIRED:
                    if (refreshToken != null) {
                        log.info("gateway - 토큰 만료. 토큰 재발급하러 감");
                        return chain.filter(exchange.mutate()
                            .request(exchange.getRequest().mutate()
                                .path("/members/token")
                                .header(SecurityConstants.REFRESH_TOKEN_HEADER, refreshToken)
                                .build())
                            .build());
                    } else {
                        log.warn("gateway - 토큰 만료. 리프레시 토큰이 없음");
                        return handleError(exchange, JwtUtil.TokenStatus.EXPIRED,
                            "토큰이 만료되었습니다. 리프레시 토큰이 필요합니다");
                    }

                case INVALID:
                    log.error("gateway - 유효하지 않은 토큰: {}", token);
                    return handleError(exchange, JwtUtil.TokenStatus.INVALID, "유효하지 않은 토큰입니다");

                case NOT_FOUND:
                    log.warn("gateway -토큰을 찾을 수 없음");
                    return handleError(exchange, JwtUtil.TokenStatus.NOT_FOUND, "토큰을 찾을 수 없습니다");

                default:
                    log.error("gateway - 토큰 처리 중 오류가 발생: {}", status);
                    return handleError(exchange, JwtUtil.TokenStatus.INVALID, "토큰 처리 중 오류가 발생했습니다");
            }
        };
    }


    private Mono<Void> handleError(ServerWebExchange exchange, JwtUtil.TokenStatus status,
        String message) {
        HttpStatus httpStatus = switch (status) {
            case EXPIRED, INVALID, NOT_FOUND -> HttpStatus.UNAUTHORIZED;
            default -> HttpStatus.INTERNAL_SERVER_ERROR;
        };

        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> errorDetails = new HashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now().toString());
        errorDetails.put("status", status.name());
        errorDetails.put("error", httpStatus.getReasonPhrase());
        errorDetails.put("message", message);
        errorDetails.put("path", exchange.getRequest().getPath().value());

        byte[] bytes = null;
        try {
            bytes = new ObjectMapper().writeValueAsBytes(errorDetails);
        } catch (JsonProcessingException e) {
            log.error("Error creating error response", e);
            bytes = "{}".getBytes();
        }

        DataBuffer buffer = exchange.getResponse().bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
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