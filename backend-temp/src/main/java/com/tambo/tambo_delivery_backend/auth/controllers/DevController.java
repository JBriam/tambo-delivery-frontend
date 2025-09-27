package com.tambo.tambo_delivery_backend.auth.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tambo.tambo_delivery_backend.auth.entities.User;
import com.tambo.tambo_delivery_backend.auth.repositories.UserDetailRepository;

@RestController
@CrossOrigin
@RequestMapping("/api/dev")
public class DevController {

    @Autowired
    private UserDetailRepository userDetailRepository;

    // SOLO PARA DESARROLLO - NO USAR EN PRODUCCIÓN
    @GetMapping("/verification-code/{email}")
    public ResponseEntity<Map<String, String>> getVerificationCode(@PathVariable String email) {
        try {
            User user = userDetailRepository.findByEmail(email);
            if (user != null && user.getVerificationCode() != null) {
                return ResponseEntity.ok(Map.of(
                    "email", email,
                    "verificationCode", user.getVerificationCode(),
                    "message", "Código de verificación obtenido exitosamente (SOLO DESARROLLO)"
                ));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}