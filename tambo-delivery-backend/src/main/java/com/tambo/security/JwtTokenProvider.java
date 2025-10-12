package com.tambo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    
    @Value("${app.jwtExpirationInMs:86400000}")
    private int jwtExpirationInMs; // 24 horas por defecto

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(userPrincipal.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            // Error de firma JWT
            return false;
        } catch (MalformedJwtException ex) {
            // Token JWT inválido
            return false;
        } catch (ExpiredJwtException ex) {
            // Token JWT expirado
            return false;
        } catch (UnsupportedJwtException ex) {
            // Token JWT no soportado
            return false;
        } catch (IllegalArgumentException ex) {
            // JWT claims string vacío
            return false;
        }
    }
}