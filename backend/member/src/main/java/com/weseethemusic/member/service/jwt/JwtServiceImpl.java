package com.weseethemusic.member.service.jwt;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.util.JwtUtil;
import com.weseethemusic.member.repository.member.MemberRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Override
    public String reIssueRefreshToken(String accessToken, String refreshToken) {
        log.debug("토큰 재발급 시작 - Access Token: {}, Refresh Token: {}", accessToken, refreshToken);

        try {
            // 토큰 존재 여부 확인
            if (accessToken == null || accessToken.isEmpty() ||
                refreshToken == null || refreshToken.isEmpty()) {
                throw new JwtException("토큰이 존재하지 않습니다.");
            }

            // Access Token 검증
            String token = jwtUtil.extractToken(accessToken);
            try {
                Claims claims = jwtUtil.validateToken(token);
                throw new JwtException("액세스 토큰이 아직 유효합니다.");
            } catch (ExpiredJwtException e) {
                log.debug("만료된 액세스 토큰 확인");
            } catch (JwtException e) {
                throw e;
            }

            // RefreshToken 검증 및 이메일 추출
            try {
                Claims claims = jwtUtil.validateToken(refreshToken);
                String email = claims.get("email", String.class);

                // Redis에 저장된 RefreshToken과 비교
                if (!jwtUtil.validateRefreshToken(refreshToken, email)) {
                    throw new JwtException("유효하지 않은 리프레시 토큰입니다.");
                }

                // 원본 액세스 토큰의 이메일과 리프레시 토큰의 이메일이 일치하는지 확인
                String originalEmail = jwtUtil.getEmailFromExpiredToken(token);
                if (!email.equals(originalEmail)) {
                    throw new JwtException("토큰 사용자 정보가 일치하지 않습니다.");
                }

                // 사용자 조회
                Optional<Member> member = memberRepository.findByEmail(email);
                if (member.isEmpty()) {
                    throw new JwtException("사용자를 찾을 수 없습니다.");
                }

                // 새로운 AccessToken 발급
                String newAccessToken = jwtUtil.generateAccessToken(
                    email,
                    member.get().getRole(),
                    member.get().getId(),
                    jwtUtil.checkOAuthToken(token)
                );

                log.info("액세스 토큰 재발급 성공");
                return newAccessToken;

            } catch (ExpiredJwtException e) {
                throw new JwtException("리프레시 토큰이 만료되었습니다.");
            }

        } catch (JwtException e) {
            log.error("토큰 재발급 실패 - {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("토큰 재발급 중 예상치 못한 에러 발생", e);
            throw new JwtException("토큰 재발급 중 오류가 발생했습니다.");
        }
    }
}