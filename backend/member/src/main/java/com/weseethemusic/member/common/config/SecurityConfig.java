package com.weseethemusic.member.common.config;

import com.weseethemusic.member.common.constants.SecurityConstants;
import com.weseethemusic.member.handler.CustomOauthSuccessHandler;
import com.weseethemusic.member.service.security.CustomOauthService;
import java.util.HashSet;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final CustomOauthSuccessHandler customOauthSuccessHandler;
  private final CustomOauthService customOauthService;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
//        .sessionManagement(
//            session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
        .cors(AbstractHttpConfigurer::disable) // CORS 설정
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .anyRequest().permitAll()
        )
        .oauth2Login(oauth -> oauth
                .userInfoEndpoint(userInfo -> userInfo.userService(customOauthService)
                    .userAuthoritiesMapper(grantedAuthoritiesMapper()))
                .successHandler(customOauthSuccessHandler)
//                .defaultSuccessUrl("http://localhost:8081/login") // 인증 성공 후 리디렉션 URL
        )
        .logout(logout -> logout
            .logoutSuccessUrl("https://www.naver.com") // 로그아웃 성공 후 리디렉션 URL
            .invalidateHttpSession(true)
            .deleteCookies(SecurityConstants.REFRESH_TOKEN_COOKIE)
        );

    return http.build();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  public AuthenticationManager authenticationManager(
      AuthenticationConfiguration authenticationConfiguration) throws Exception {
    return authenticationConfiguration.getAuthenticationManager();
  }

  @Bean
  public UrlBasedCorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.addAllowedOriginPattern("*");
    configuration.setAllowCredentials(true);
    configuration.addAllowedHeader("*");
    configuration.addAllowedMethod("*");
    configuration.addExposedHeader("*");

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public GrantedAuthoritiesMapper grantedAuthoritiesMapper() {
    return authorities -> new HashSet<>(authorities);
  }
}
