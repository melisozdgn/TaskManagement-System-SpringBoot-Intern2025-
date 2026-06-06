package com.officepal.officepal_api.controller;

import com.officepal.officepal_api.service.AuthService;
import com.officepal.officepal_api.dto.RegisterRequest;
import com.officepal.officepal_api.dto.LoginRequest;
import com.officepal.officepal_api.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
} 