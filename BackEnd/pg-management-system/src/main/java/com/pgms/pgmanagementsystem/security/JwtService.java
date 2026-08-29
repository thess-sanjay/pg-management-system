package com.pgms.pgmanagementsystem.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // =========================================
    // SECRET KEY
    // =========================================

    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }


    // =========================================
    // GENERATE TOKEN
    // =========================================

    public String generateToken(String email) {

        Date now = new Date();

        Date expiryDate =
                new Date(
                        now.getTime() + expiration
                );

        return Jwts.builder()

                .subject(email)

                .issuedAt(now)

                .expiration(expiryDate)

                .signWith(getSigningKey())

                .compact();
    }


    // =========================================
    // EXTRACT EMAIL
    // =========================================

    public String extractEmail(String token) {

        return getClaims(token)
                .getSubject();
    }


    // =========================================
    // EXTRACT CLAIMS
    // =========================================

    private Claims getClaims(String token) {

        return Jwts.parser()

                .verifyWith(getSigningKey())

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }


    // =========================================
    // VALIDATE TOKEN
    // =========================================

    public boolean isTokenValid(
            String token,
            String email
    ) {

        try {

            String tokenEmail =
                    extractEmail(token);

            return tokenEmail.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;

        }
    }


    // =========================================
    // CHECK EXPIRATION
    // =========================================

    private boolean isTokenExpired(
            String token
    ) {

        Date expirationDate =
                getClaims(token)
                        .getExpiration();

        return expirationDate.before(
                new Date()
        );
    }
}