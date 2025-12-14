package com.kheyma.controller;

import com.kheyma.dto.AuthRequest;
import com.kheyma.dto.AuthResponse;
import com.kheyma.dto.RegisterRequest;
import com.kheyma.dto.UserDTO;
import com.kheyma.model.User;
import com.kheyma.repository.UserRepository;
import com.kheyma.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final UserRepository userRepository;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
    
    @GetMapping("/me")
    public ResponseEntity<User> getMe(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Don't return password hash
        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }
    
    @PutMapping("/me")
    public ResponseEntity<User> updateMe(
            @RequestBody UserDTO userDTO,
            Authentication authentication
    ) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (userDTO.getDob() != null) {
            user.setDob(userDTO.getDob());
        }
        if (userDTO.getAddress() != null) {
            user.setAddress(userDTO.getAddress());
        }
        if (userDTO.getPackageType() != null) {
            if (user.getUserPackage() == null) {
                user.setUserPackage(new User.UserPackage());
            }
            user.getUserPackage().setPackageType(userDTO.getPackageType());
        }
        
        user.setUpdatedAt(java.time.LocalDateTime.now());
        user = userRepository.save(user);
        user.setPasswordHash(null);
        return ResponseEntity.ok(user);
    }
}