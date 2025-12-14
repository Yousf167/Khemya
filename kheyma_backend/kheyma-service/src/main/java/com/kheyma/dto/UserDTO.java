package com.kheyma.dto;

import com.kheyma.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String email;
    private String password;
    private LocalDate dob;
    private String address;
    private User.UserPackage.PackageType packageType;
}