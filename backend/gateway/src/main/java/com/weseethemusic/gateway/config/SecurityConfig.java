package com.weseethemusic.gateway.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        return http.csrf(csrf -> csrf.disable())
            .cors(corsConfig -> corsConfig.configurationSource(request -> {
                CorsConfiguration config = new CorsConfiguration();
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

                config.addAllowedOriginPattern("*");
                config.setAllowCredentials(true);
                config.addAllowedMethod("*");
                config.addAllowedHeader("*");
                config.addExposedHeader("*");

                source.registerCorsConfiguration("/**", config);

                return config;
            })).authorizeExchange(exchanges -> exchanges.anyExchange().permitAll()
//                .pathMatchers(
//                    "/members/register/token",
//                    "/members/register/check/token",
//                    "/members/register",
//                    "/members/login"
//                ).permitAll()
//                .pathMatchers("/actuator/health").permitAll()
            ).build();
    }
}
