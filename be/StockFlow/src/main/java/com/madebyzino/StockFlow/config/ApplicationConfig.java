package com.madebyzino.StockFlow.config;

import com.madebyzino.StockFlow.repository.UserRepository;
import com.madebyzino.StockFlow.security.SimpleUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {
    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return loginId -> userRepository.findByUsername(loginId)
                .map(user -> new SimpleUserDetails(
                        user.getId(),
                        user.getUsername(),
                        user.getRole().name(),
                        user.getPassword()
                ))
                .orElseThrow(() -> new UsernameNotFoundException(
                        "해당 등록된 계정이 없습니다: " + loginId));
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
