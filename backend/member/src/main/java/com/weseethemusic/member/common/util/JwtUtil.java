package com.weseethemusic.member.common.util;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.repository.MemberRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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

    public enum TokenStatus {
        VALID,
        INVALID,
        NOT_FOUND,
        EXPIRED
    }

    private final MemberRepository memberRepository;
    private final RedisTemplate<String, Object> redisTemplate;  // Object로 변경

    public JwtUtil(MemberRepository memberRepository, RedisTemplate<String, Object> redisTemplate) {
        this.memberRepository = memberRepository;
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
    public String generateAccessToken(String email, String role, Long id) {
        return Jwts.builder()
            .issuer("MoDoo")
            .subject("JWT Token")
            .claim("email", email)
            .claim("role", role)
            .claim("id", id)
            .issuedAt(new Date())
            .expiration(
                new Date(System.currentTimeMillis() + accessTokenExpiration))
            .signWith(key)
            .compact();
    }

    // refresh token 검증, 새로운 access token 및 refresh token 발급
    public Map<String, String> reissueTokens(String refreshToken) {
        try {
            Claims claims = validateToken(refreshToken);
            String email = claims.get("email", String.class);

            // Redis에서 토큰 직접 조회
            String storedToken = (String) redisTemplate.opsForValue().get("RT:" + email);

            if (storedToken == null || !storedToken.equals(refreshToken)) {
                throw new RuntimeException("Invalid refresh token");
            }

            // 사용자 역할 조회
            Optional<Member> member = memberRepository.findByEmail(email);
            if (!member.isPresent()) {
                throw new RuntimeException("User not found");
            }
            String role = member.get().getRole();
            Long id = member.get().getId();

            // 새로운 액세스 토큰과 리프레시 토큰 발급
            String newAccessToken = generateAccessToken(email, role, id);
            String newRefreshToken = generateRefreshToken(email);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", newAccessToken);
            tokens.put("refreshToken", newRefreshToken);

            return tokens;
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Refresh token has expired");
        } catch (Exception e) {
            throw new RuntimeException("Failed to reissue tokens: " + e.getMessage());
        }
    }

    // 토큰 검증
    public Claims validateToken(String token) {
        try {
            return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
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

    public Long getUserIdFromToken(String bearerToken) {
        String token = extractToken(bearerToken);
        Claims claims = validateToken(token);
        String email = claims.get("email", String.class);

        Optional<Member> userOptional = memberRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            return userOptional.get().getId();
        } else {
            throw new RuntimeException("해당 email의 유저를 찾을 수 없음: " + email);
        }
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

}
