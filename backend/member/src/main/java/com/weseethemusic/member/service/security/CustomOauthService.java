package com.weseethemusic.member.service.security;

import com.weseethemusic.member.common.entity.Member;
import com.weseethemusic.member.common.entity.Member.Role;
import com.weseethemusic.member.repository.member.MemberRepository;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomOauthService extends DefaultOAuth2UserService {

  private final MemberRepository memberRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) {
    OAuth2User oAuth2User = super.loadUser(userRequest);
    Map<String, Object> attributes = oAuth2User.getAttributes();

    // provider 이름 가져오기
    String provider = userRequest.getClientRegistration().getRegistrationId();

    // 사용자 정보 추출
    final String[] email = {(String) attributes.get("email")};

    // 기존 사용자 확인
    Member member = memberRepository.findByEmail(email[0]).orElseGet(() -> {
      // 신규 사용자 생성 (최초 로그인 시에만)
      Member newMember = new Member();
      newMember.setEmail(email[0]);

      // provider별 정보 가져오기
      String nickname = null;
      String profileImage = null;
      switch (provider.toLowerCase()) {
        case "google" -> {
          nickname = (String) attributes.get("name");
          profileImage = (String) attributes.get("picture");
        }
        case "spotify" -> {
          nickname = (String) attributes.get("display_name");
          List<?> images = (List<?>) attributes.get("images");
          if (images != null && !images.isEmpty()) {
            profileImage = (String) ((Map<String, Object>) images.get(0)).get("url");
          }
        }
        case "kakao" -> {
          Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
          if (kakaoAccount != null) {
            email[0] = (String) kakaoAccount.get("email");

            // profile 객체가 null이 아닌지 확인
            Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
            if (profile != null) {
              nickname = (String) profile.get("nickname");
              profileImage = (String) profile.get("profile_image_url");
            }
          }
        }

      }

      // nickname 기본값 설정
      if (nickname == null || nickname.trim().isEmpty()) {
        nickname = email[0] != null && email[0].contains("@") ? email[0].split("@")[0] : "Anonymous";
      }

      // 초기 사용자 정보 저장
      newMember.setNickname(nickname);
      newMember.setProfileImage(profileImage);
      newMember.setProvider(provider);
      newMember.setCreatedAt(new Date());
      newMember.setRole(Role.USER);
      memberRepository.save(newMember);
      return newMember;
    });

    // 이미 저장된 사용자 정보로 OAuth2User 반환
    Map<String, Object> userAttributes = Map.of(
        "id", member.getId(),
        "nickname", member.getNickname(),
        "email", member.getEmail(),
        "profileImage", member.getProfileImage()
    );

    return new DefaultOAuth2User(
        Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
        userAttributes,
        "email"
    );
  }
}
