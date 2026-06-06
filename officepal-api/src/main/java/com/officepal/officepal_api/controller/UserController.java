package com.officepal.officepal_api.controller;

import com.officepal.officepal_api.entity.User;
import com.officepal.officepal_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    public static class UserDto {
        public Long id;
        public String username;
        public String email;
        public UserDto(Long id, String username, String email) {
            this.id = id;
            this.username = username;
            this.email = email;
        }
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
            .map(u -> new UserDto(u.getId(), u.getUsername(), u.getEmail()))
            .collect(Collectors.toList());
    }
} 