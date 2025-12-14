package com.kheyma.service;

import com.kheyma.aspect.Auditable;
import com.kheyma.dto.UserDTO;
import com.kheyma.model.User;
import com.kheyma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AdminService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public User getUserById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
    
    @Auditable
    public User updateUser(String id, UserDTO userDTO) {
        User user = getUserById(id);
        
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
        if (userDTO.getDob() != null) {
            user.setDob(userDTO.getDob());
        }
        if (userDTO.getAddress() != null) {
            user.setAddress(userDTO.getAddress());
        }
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        }
        if (userDTO.getPackageType() != null) {
            if (user.getUserPackage() == null) {
                user.setUserPackage(new User.UserPackage());
            }
            user.getUserPackage().setPackageType(userDTO.getPackageType());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    @Auditable
    public void deleteUser(String id) {
        if (id == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = Objects.requireNonNull(getUserById(id), "User must not be null");
        userRepository.delete(user);
    }
    
    @Auditable
    public User toggleUserStatus(String id) {
        User user = getUserById(id);
        user.setEnabled(!user.isEnabled());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    @Auditable
    public User makeAdmin(String id) {
        User user = getUserById(id);
        user.setType(User.UserType.ADMIN);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
    
    @Auditable
    public User updateUserPackage(String id, User.UserPackage.PackageType packageType) {
        User user = getUserById(id);
        if (user.getUserPackage() == null) {
            user.setUserPackage(new User.UserPackage());
        }
        user.getUserPackage().setPackageType(packageType);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }
}