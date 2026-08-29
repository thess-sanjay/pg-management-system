package com.pgms.pgmanagementsystem.service;

import com.pgms.pgmanagementsystem.dto.AuthResponse;
import com.pgms.pgmanagementsystem.entity.User;
import com.pgms.pgmanagementsystem.repository.UserRepository;
import com.pgms.pgmanagementsystem.security.JwtService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // =========================================
    // REGISTER
    // =========================================

    public AuthResponse register(
            String name,
            String email,
            String password
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException(
                    "User already exists with this email"
            );
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);

        // Never store plain-text password
        user.setPassword(
                passwordEncoder.encode(password)
        );

        user.setRole("ADMIN");

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole(),
                null
        );
    }

    // =========================================
    // LOGIN
    // =========================================

    public AuthResponse login(
            String email,
            String password
    ) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                email,
                                password
                        )
                );

        String token =
                jwtService.generateToken(
                        authentication.getName()
                );

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        return new AuthResponse(
                "Login successful",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                token
        );
    }
}