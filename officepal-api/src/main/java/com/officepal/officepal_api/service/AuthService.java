package com.officepal.officepal_api.service;

import com.officepal.officepal_api.repository.UserRepository;
import com.officepal.officepal_api.config.JwtUtil;
import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.dto.RegisterRequest;
import com.officepal.officepal_api.dto.LoginRequest;
import com.officepal.officepal_api.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent() ||
            userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, "Registration successful");
    }
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsernameOrEmail())
            .orElse(userRepository.findByEmail(request.getUsernameOrEmail())
            .orElseThrow(() -> new RuntimeException("User not found")));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, "Login successful");
    }
}