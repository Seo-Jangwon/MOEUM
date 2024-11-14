package com.weseethemusic.member.common.config;

import com.weseethemusic.member.common.constants.SecurityConstants;
import com.weseethemusic.member.handler.CustomOAuthFailureHandler;
import com.weseethemusic.member.handler.CustomOAuthSuccessHandler;
import com.weseethemusic.member.service.security.CustomOauthService;
import java.util.HashSet;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.RequestCacheConfigurer;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuthSuccessHandler customOAuthSuccessHandler;
    private final CustomOAuthFailureHandler customOAuthFailureHandler;
    private final CustomOauthService customOauthService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(corsConfig -> corsConfig.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                config.setAllowedOrigins(List.of("https://weseethemusic.com", "http://localhost:5173"));
                config.setAllowCredentials(true);
                config.setAllowedMethods(
                    List.of("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                config.addExposedHeader(SecurityConstants.JWT_HEADER);

                source.registerCorsConfiguration("/**", config);

                return config;
            })).requestCache(RequestCacheConfigurer::disable).authorizeHttpRequests(
                auth -> auth.requestMatchers("/admin/**").hasRole("ADMIN").anyRequest().permitAll())
            .oauth2Login(oauth -> oauth.authorizationEndpoint(
                        authorization -> authorization.baseUri("/members/oauth2/authorization"))
                    .redirectionEndpoint(redirection -> redirection.baseUri("/members/oauth2/code/*"))
                    .userInfoEndpoint(userInfo -> userInfo.userService(customOauthService)
                        .userAuthoritiesMapper(grantedAuthoritiesMapper()))
                    .successHandler(customOAuthSuccessHandler).failureHandler(customOAuthFailureHandler)
//                .failureUrl("https://www.daum.net")
//                .defaultSuccessUrl("http://localhost:8081/login") // 인증 성공 후 리디렉션 URL
            )
            .logout(logout -> logout.logoutSuccessUrl("https://www.naver.com") // 로그아웃 성공 후 리디렉션 URL
                .invalidateHttpSession(true).deleteCookies(SecurityConstants.REFRESH_TOKEN_COOKIE));

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
        return HashSet::new;
    }

}
