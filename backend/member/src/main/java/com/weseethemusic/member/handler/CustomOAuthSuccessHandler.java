package com.weseethemusic.member.handler;

import com.weseethemusic.member.common.constants.SecurityConstants;
import com.weseethemusic.member.common.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomOAuthSuccessHandler implements AuthenticationSuccessHandler {

  private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();
  private final JwtUtil jwtUtil;

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String email = oAuth2User.getAttribute("email");
    String nickname = oAuth2User.getAttribute("nickname");
    String profileImage = oAuth2User.getAttribute("profileImage");
    Long userId = oAuth2User.getAttribute("id");

    // JWT 액세스 및 리프레시 토큰 생성
    String accessToken = jwtUtil.generateAccessToken(email, "USER", userId, true);
    String refreshToken = jwtUtil.generateRefreshToken(email);

    // 리프레시 토큰을 Redis에 저장
    jwtUtil.storeRefreshTokenInRedis(email, refreshToken);

    // 리프레시 토큰을 HTTP-Only 쿠키로 설정
    ResponseCookie refreshTokenCookie = ResponseCookie.from(SecurityConstants.REFRESH_TOKEN_COOKIE, refreshToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(Duration.ofDays(7))
        .sameSite("None")
        .build();
    response.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());

    // 액세스 토큰을 응답 헤더에 추가
    response.setHeader(SecurityConstants.JWT_HEADER, "Bearer " + accessToken);

    // 프론트엔드로 리디렉션 URL 설정
    String targetUrl = UriComponentsBuilder.fromUriString("https://weseethemusic.com/oauth")
        .queryParam("email", email)
        .queryParam("name", nickname)
        .queryParam("profileImage", profileImage)
        .encode(StandardCharsets.UTF_8)
        .build()
        .toUriString();

    // 리디렉션 처리
    redirectStrategy.sendRedirect(request, response, targetUrl);
  }
}
