package com.kheyma.controller;

import com.kheyma.dto.UserDTO;
import com.kheyma.model.User;
import com.kheyma.service.AdminService;
import com.kheyma.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    private final AnalyticsService analyticsService;
    
    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    
    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }
    
    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(adminService.updateUser(id, userDTO));
    }
    
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable String id) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id));
    }
    
    @PatchMapping("/users/{id}/make-admin")
    public ResponseEntity<User> makeAdmin(@PathVariable String id) {
        return ResponseEntity.ok(adminService.makeAdmin(id));
    }
    
    @PatchMapping("/users/{id}/package")
    public ResponseEntity<User> updateUserPackage(
            @PathVariable String id,
            @RequestParam User.UserPackage.PackageType packageType
    ) {
        return ResponseEntity.ok(adminService.updateUserPackage(id, packageType));
    }
    
    // Analytics
    @GetMapping("/analytics/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardAnalytics());
    }
    
    @GetMapping("/analytics/transactions/stats")
    public ResponseEntity<Map<String, Object>> getTransactionStatistics() {
        return ResponseEntity.ok(analyticsService.getTransactionStatistics());
    }
    
    @GetMapping("/analytics/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStatistics() {
        return ResponseEntity.ok(analyticsService.getRevenueStatistics());
    }
    
    @GetMapping("/analytics/popular-locations")
    public ResponseEntity<List<Map<String, Object>>> getPopularLocations() {
        return ResponseEntity.ok(analyticsService.getPopularLocations());
    }
}