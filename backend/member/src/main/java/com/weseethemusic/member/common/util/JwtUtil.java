package com.weseethemusic.member.common.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import javax.crypto.SecretKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.RedisOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.SessionCallback;
import org.springframework.stereotype.Component;


// JwtUtil.java
@Slf4j
@Component
public class JwtUtil {


    private final RedisTemplate<String, Object> redisTemplate;  // Object로 변경

    public JwtUtil(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        log.info("JWT 액세스 토큰 만료 시간: {}ms, 리프레시 토큰 만료 시간: {}ms",
            this.accessTokenExpiration, this.refreshTokenExpiration);
    }

    // refresh token 생성 및 Redis 저장
    public String generateRefreshToken(String email) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plus(refreshTokenExpiration, ChronoUnit.MILLIS);

        String refreshToken = Jwts.builder()
            .issuer("MoDoo")
            .subject("Refresh Token")
            .claim("email", email)
            .issuedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()))
            .expiration(Date.from(expiresAt.atZone(ZoneId.systemDefault()).toInstant()))
            .signWith(key)
            .compact();

        // Redis에 토큰 직접 저장
        redisTemplate.execute(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                operations.multi();
                operations.opsForValue()
                    .set("RT:" + email, refreshToken, refreshTokenExpiration,
                        TimeUnit.MILLISECONDS);
                return operations.exec();
            }
        });

        return refreshToken;
    }

    public String getEmailFromExpiredToken(String token) {
        try {
            Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return claims.get("email", String.class);
        } catch (ExpiredJwtException e) {
            return e.getClaims().get("email", String.class);
        } catch (JwtException e) {
            throw new JwtException("유효하지 않은 토큰 형식입니다.");
        }
    }

    // access token 생성
    public String generateAccessToken(String email, String role, Long id, boolean isOAuth) {
        return Jwts.builder()
            .issuer("MoDoo")
            .subject("JWT Token")
            .claim("email", email)
            .claim("role", role)
            .claim("id", id)
            .claim("isOAuth", isOAuth)
            .issuedAt(new Date())
            .expiration(
                new Date(System.currentTimeMillis() + accessTokenExpiration))
            .signWith(key)
            .compact();
    }


    // 토큰 검증
    public Claims validateToken(String token) {
        try {
            log.debug("토큰 검증 시작: {}", token.substring(0, Math.min(token.length(), 20)) + "...");
            Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            log.debug("토큰 검증 성공");
            return claims;
        } catch (ExpiredJwtException e) {
            log.debug("토큰 만료됨. 만료시간: {}", e.getClaims().getExpiration());
            throw e;
        } catch (JwtException e) {
            log.error("토큰 검증 실패: {}", e.getMessage());
            throw e;
        }
    }

    public boolean validateRefreshToken(String refreshToken, String email) {
        String storedToken = (String) redisTemplate.opsForValue().get("RT:" + email);
        return storedToken != null && storedToken.equals(refreshToken);
    }

    public String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }

    public String getEmailFromToken(String bearerToken) {
        String token = extractToken(bearerToken);
        Claims claims = validateToken(token);
        return claims.get("email", String.class);
    }

    public boolean checkOAuthToken(String token) {
        Claims claims = validateToken(token);
        return claims.get("isOAuth", boolean.class);
    }

    public String getRoleFromToken(String bearerToken) {
        String token = extractToken(bearerToken);
        Claims claims = validateToken(token);
        return claims.get("role", String.class);
    }

    public void invalidateRefreshToken(String email) {
        redisTemplate.execute(new SessionCallback<Object>() {
            @Override
            public Object execute(RedisOperations operations) throws DataAccessException {
                operations.multi();
                operations.delete("RT:" + email);
                return operations.exec();
            }
        });
    }

    public boolean logout(String token) {
        try {
            String email = getEmailFromToken(token);
            log.info("Logging out user: {}", email);

            Long result = redisTemplate.execute(new SessionCallback<Long>() {
                @Override
                public Long execute(RedisOperations operations) throws DataAccessException {
                    operations.multi();
                    operations.delete("RT:" + email);
                    List<Object> results = operations.exec();
                    return (Long) results.get(0);
                }
            });

            if (result != null && result > 0) {
                log.info("사용자 {}가 로그아웃 됨", email);
                return true;
            } else {
                log.warn("사용자 {} 로그아웃 실패. Redis에 토큰이 존재하지 않습니다.", email);
                return false;
            }
        } catch (Exception e) {
            log.error("로그아웃 중 에러 발생: ", e);
            return false;
        }
    }

    public void storeRefreshTokenInRedis(String email, String refreshToken) {
        redisTemplate.opsForValue().set("RT:" + email, refreshToken, refreshTokenExpiration, TimeUnit.MILLISECONDS);
    }


}
