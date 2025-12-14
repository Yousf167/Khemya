package com.kheyma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "transactions")
public class Transaction {
    
    @Id
    private String id; // MongoDB ObjectId
    
    @NotNull(message = "User ID is required")
    private String userId; // MongoDB ObjectId reference
    
    @NotNull(message = "Transaction ID is required")
    private Integer transId; // Row number / sequential transaction ID
    
    @NotNull(message = "Amount is required")
    private Double amount;
    
    @NotNull(message = "Location is required")
    private LocationReference location; // Location object reference
    
    @NotNull(message = "Package is required")
    private PackageType packageType;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    public enum PackageType {
        BASIC,      // full meal options
        ADVANCED,   // full meal options + all activities
        FULL        // all options
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LocationReference {
        private String locationId;
        private String name;
        private Double latitude;
        private Double longitude;
    }
}