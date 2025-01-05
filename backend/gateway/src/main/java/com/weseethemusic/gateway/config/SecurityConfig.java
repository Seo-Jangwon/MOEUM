package com.weseethemusic.gateway.config;


import com.weseethemusic.gateway.constants.SecurityConstants;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http.csrf(csrf -> csrf.disable())
            .cors(corsConfig -> corsConfig.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                config.setAllowedOrigins(
                    List.of("https://weseethemusic.com", "http://localhost:5173"));
                config.setAllowCredentials(true);
                config.setAllowedMethods(
                    List.of("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                config.addExposedHeader(SecurityConstants.JWT_HEADER);

                source.registerCorsConfiguration("/**", config);

                return config;
            })).requestCache(cache -> cache.disable()) // 요청 캐시 비활성화
            .securityContextRepository(
                NoOpServerSecurityContextRepository.getInstance()) // 서버 세션 비활성화
            .authorizeExchange(exchanges -> exchanges
                .anyExchange().permitAll()
            )
            .build();
    }
}
