package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.AuthRequest;
import com.madebyzino.StockFlow.dto.AuthResponse;
import com.madebyzino.StockFlow.dto.RegisterRequest;
import com.madebyzino.StockFlow.dto.UserDto;
import com.madebyzino.StockFlow.entity.User;
import com.madebyzino.StockFlow.exception.TokenRefreshException;
import com.madebyzino.StockFlow.exception.UserException;
import com.madebyzino.StockFlow.repository.UserRepository;
import com.madebyzino.StockFlow.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isEmpty()) {
            throw new UserException("사용자명이 이미 존재합니다");
        }

        User user = User.from(request, (passwordEncoder.encode(request.getPassword())));

        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {

        String loginId = request.getLoginId();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginId,
                            request.getPassword()
                    )
            );

        } catch (AuthenticationException e) {
            System.out.println("인증 실패: " + e.getMessage());
            throw e;
        }

        User user = userRepository.findByUsername(loginId)
                .orElseThrow(() -> new UsernameNotFoundException("인증 후 사용자 정보를 찾을 수 없습니다: " + loginId));

        String jwtToken = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .user(UserDto.fromEntity(user))
                .build();

    }

    public AuthResponse refreshToken(HttpServletRequest request) {
        String refreshToken = request.getHeader("X-Refresh-Token");
        final String username;

        try {
            username = jwtService.extractUsername(refreshToken);
        } catch (Exception e) {
            throw new TokenRefreshException(refreshToken, "유효하지 않거나 만료된 리프레시 토큰입니다.");
        }

        if (username == null) {
            throw new TokenRefreshException(refreshToken, "리프레시 토큰에 사용자 정보(이메일)가 누락되었습니다.");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new TokenRefreshException(refreshToken, "토큰 정보와 일치하는 사용자를 찾을 수 없습니다."));

        if (!jwtService.isTokenValid(refreshToken, user.getUsername())) {
            throw new TokenRefreshException(refreshToken, "리프레시 토큰이 만료되었거나 서명이 유효하지 않습니다.");
        }

        String newAccessToken = jwtService.generateToken(user);
        String newRefreshToken = jwtService.generateRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .user(UserDto.fromEntity(user))
                .build();
    }

    public void logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String accessToken = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;

        String refreshToken = request.getHeader("X-Refresh-Token");

        if (accessToken == null && refreshToken == null) {
            SecurityContextHolder.clearContext();
            return;
        }

        SecurityContextHolder.clearContext();
    }

}