package com.pgms.pgmanagementsystem.controller;

import com.pgms.pgmanagementsystem.dto.AuthResponse;
import com.pgms.pgmanagementsystem.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================================
    // REGISTER
    // =========================================

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(

            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password

    ) {

        AuthResponse response =
                authService.register(
                        name,
                        email,
                        password
                );

        return ResponseEntity.ok(response);
    }

    // =========================================
    // LOGIN
    // =========================================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(

            @RequestParam String email,
            @RequestParam String password

    ) {

        AuthResponse response =
                authService.login(
                        email,
                        password
                );

        return ResponseEntity.ok(response);
    }
}