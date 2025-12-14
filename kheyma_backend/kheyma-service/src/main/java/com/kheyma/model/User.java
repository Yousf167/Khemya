package com.kheyma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    
    @Id
    private String id; // MongoDB ObjectId
    
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Indexed(unique = true)
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String passwordHash;
    
    private LocalDate dob; // Date of Birth
    
    private String address;
    
    private UserType type; // admin or user
    
    private UserPackage userPackage; // Package information
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private boolean enabled = true;
    
    public enum UserType {
        ADMIN,
        USER
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserPackage {
        private PackageType packageType;
        
        public enum PackageType {
            BASIC,      // full meal options
            ADVANCED,   // full meal options + all activities
            FULL        // all options
        }
    }
}