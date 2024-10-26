package com.weseethemusic.gateway.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;


@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.disable())
            .authorizeExchange(exchanges -> exchanges
                // 인증 불필요
                .pathMatchers("/members/register/token",
                    "/members/register/check/token",
                    "/members/register",
                    "/members/login").permitAll()
                // 나머지는 인증 필요
                .anyExchange().authenticated()
            )
            .build();
    }
}