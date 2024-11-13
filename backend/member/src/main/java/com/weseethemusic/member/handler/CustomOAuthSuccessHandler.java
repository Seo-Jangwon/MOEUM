package com.weseethemusic.member.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomOAuthSuccessHandler implements AuthenticationSuccessHandler {

  private final RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
      Authentication authentication) throws IOException, ServletException {

    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    String provider = (String) request.getSession().getAttribute("provider");

    // 필요한 정보 가져오기 (email, nickname, profileImage)
    String email = oAuth2User.getAttribute("email");
    String nickname = null;
    String profileImage = null;

    if ("google".equalsIgnoreCase(provider)) {
      nickname = (String) oAuth2User.getAttribute("name");
      profileImage = (String) oAuth2User.getAttribute("picture");

    } else if ("spotify".equalsIgnoreCase(provider)) {
      nickname = (String) oAuth2User.getAttribute("display_name");

      // Spotify의 프로필 이미지 가져오기
      Map<String, Object> images = (Map<String, Object>) oAuth2User.getAttribute("images");
      if (images != null && !images.isEmpty()) {
        profileImage = (String) ((Map<String, Object>) images.get(0)).get("url");
      }

    } else if ("kakao".equalsIgnoreCase(provider)) {
      Map<String, Object> kakaoAccount = (Map<String, Object>) oAuth2User.getAttribute("kakao_account");
      if (kakaoAccount != null) {
        email = (String) kakaoAccount.get("email");

        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile != null) {
          nickname = (String) profile.get("nickname");
          profileImage = (String) profile.get("profile_image_url");
        }
      }
    }

    // nickname 기본값 설정
    if (nickname == null || nickname.trim().isEmpty()) {
      nickname = (email != null && email.contains("@")) ? email.split("@")[0] : "Anonymous";
    }

    log.info("Provider: " + provider);
    log.info("Nickname: " + nickname);

    // access_token 및 refresh_token 가져오기
    String accessToken = (String) oAuth2User.getAttribute("access_token");
    String refreshToken = (String) oAuth2User.getAttribute("refresh_token");

    // access_token과 refresh_token을 세션에 저장
    request.getSession().setAttribute("ACCESS_TOKEN", accessToken);
    request.getSession().setAttribute("REFRESH_TOKEN", refreshToken);

    // 프론트엔드로 리디렉션 URL 설정
    String targetUrl = "https://www.naver.com"; // 프론트엔드 URL로 수정
    String target = UriComponentsBuilder.fromUriString(targetUrl)
        .queryParam("email", email)
        .queryParam("name", nickname)
        .queryParam("profileImage", profileImage)
        .build().toUriString();

    // 리디렉션 처리
    redirectStrategy.sendRedirect(request, response, target);
  }
}
