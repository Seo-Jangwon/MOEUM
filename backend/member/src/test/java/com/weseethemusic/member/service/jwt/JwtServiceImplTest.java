package com.weseethemusic.member.service.jwt;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.util.JwtUtil;
import com.weseethemusic.member.repository.MemberRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class JwtServiceImplTest {

    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private JwtServiceImpl jwtService;

    private String validAccessToken = "valid.access.token";
    private String validRefreshToken = "valid.refresh.token";
    private String email = "test@example.com";

    @Test
    @DisplayName("토큰 재발급 성공")
    void reIssueTokenSuccess() {
        // given
        String expiredAccessToken = "expired.access.token";
        Member member = createMember();
        Claims claims = Mockito.mock(Claims.class);
        when(claims.get("email", String.class)).thenReturn(email);

        when(jwtUtil.extractToken(validAccessToken)).thenReturn(expiredAccessToken);
        when(jwtUtil.validateToken(expiredAccessToken)).thenThrow(new ExpiredJwtException(null, null, "만료된 토큰"));
        when(jwtUtil.validateToken(validRefreshToken)).thenReturn(claims);
        when(jwtUtil.validateRefreshToken(validRefreshToken, email)).thenReturn(true);
        when(jwtUtil.getEmailFromExpiredToken(expiredAccessToken)).thenReturn(email);
        when(memberRepository.findByEmail(email)).thenReturn(Optional.of(member));
        when(jwtUtil.generateAccessToken(email, member.getRole(), member.getId())).thenReturn("new.access.token");

        // when
        String newAccessToken = jwtService.reIssueRefreshToken(validAccessToken, validRefreshToken);

        // then
        assertNotNull(newAccessToken);
        assertEquals("new.access.token", newAccessToken);
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 토큰 누락")
    void reIssueTokenFailMissingToken() {
        // when & then
        assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken(null, validRefreshToken));
        assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken(validAccessToken, null));
        assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken("", validRefreshToken));
        assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken(validAccessToken, ""));
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 액세스 토큰이 아직 유효함")
    void reIssueTokenFailAccessTokenStillValid() {
        // given
        String validToken = "valid.token";
        Claims claims = Mockito.mock(Claims.class);

        when(jwtUtil.extractToken(validAccessToken)).thenReturn(validToken);
        when(jwtUtil.validateToken(validToken)).thenReturn(claims); // 유효한 토큰이므로 claims 반환

        // when & then
        JwtException exception = assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken(validAccessToken, validRefreshToken));

        assertEquals("액세스 토큰이 아직 유효합니다.", exception.getMessage());

        // verify
        verify(jwtUtil).extractToken(validAccessToken);
        verify(jwtUtil).validateToken(validToken);
        verify(claims, never()).get(anyString(), any());
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 유효하지 않은 리프레시 토큰")
    void reIssueTokenFailInvalidRefreshToken() {
        // given
        String expiredAccessToken = "expired.access.token";
        Claims claims = Mockito.mock(Claims.class);
        when(claims.get("email", String.class)).thenReturn(email);

        when(jwtUtil.extractToken(validAccessToken)).thenReturn(expiredAccessToken);
        when(jwtUtil.validateToken(expiredAccessToken)).thenThrow(new ExpiredJwtException(null, null, "만료된 토큰"));
        when(jwtUtil.validateToken(validRefreshToken)).thenReturn(claims);
        when(jwtUtil.validateRefreshToken(validRefreshToken, email)).thenReturn(false);

        // when & then
        JwtException exception = assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken(validAccessToken, validRefreshToken));

        assertEquals("유효하지 않은 리프레시 토큰입니다.", exception.getMessage());
    }

    @Test
    @DisplayName("토큰 재발급 실패 - 토큰의 이메일 불일치")
    void reIssueTokenFailEmailMismatch() {
        // given
        String expiredAccessToken = "expired.access.token";
        String differentEmail = "different@example.com";
        Claims claims = Mockito.mock(Claims.class);
        when(claims.get("email", String.class)).thenReturn(email);

        when(jwtUtil.extractToken(validAccessToken)).thenReturn(expiredAccessToken);
        when(jwtUtil.validateToken(expiredAccessToken)).thenThrow(new ExpiredJwtException(null, null, "만료된 토큰"));
        when(jwtUtil.validateToken(validRefreshToken)).thenReturn(claims);
        when(jwtUtil.validateRefreshToken(validRefreshToken, email)).thenReturn(true);
        when(jwtUtil.getEmailFromExpiredToken(expiredAccessToken)).thenReturn(differentEmail);

        // when & then
        JwtException exception = assertThrows(JwtException.class, () ->
            jwtService.reIssueRefreshToken(validAccessToken, validRefreshToken));

        assertEquals("토큰 사용자 정보가 일치하지 않습니다.", exception.getMessage());
    }

    private Member createMember() {
        Member member = new Member();
        member.setId(1L);
        member.setEmail(email);
        member.setRole(Member.Role.USER);
        return member;
    }
}