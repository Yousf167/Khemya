package com.kheyma.service;

import com.kheyma.aspect.Auditable;
import com.kheyma.dto.AuthRequest;
import com.kheyma.dto.AuthResponse;
import com.kheyma.dto.RegisterRequest;
import com.kheyma.model.User;
import com.kheyma.repository.UserRepository;
import com.kheyma.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    
    @Auditable
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setDob(request.getDob());
        user.setAddress(request.getAddress());
        user.setType(User.UserType.USER);
        
        // Set default package if provided
        if (request.getPackageType() != null) {
            User.UserPackage userPackage = new User.UserPackage();
            userPackage.setPackageType(request.getPackageType());
            user.setUserPackage(userPackage);
        }
        
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        
        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        // Don't return password hash
        user.setPasswordHash(null);
        
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getType().name(),
                user
        );
    }
    
    @Auditable
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);
        
        // Don't return password hash
        user.setPasswordHash(null);
        
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getType().name(),
                user
        );
    }
}