package com.weseethemusic.member.controller.member;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/members")
public class OAuthController {

  @GetMapping("/oauth")
  public Map<String, Object> getOAuthUserInfo(@AuthenticationPrincipal OAuth2User oAuth2User) {
    if (oAuth2User != null) {
      return oAuth2User.getAttributes();
    } else {
      return Map.of("error", "User not authenticated");
    }
  }
}
