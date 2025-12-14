package com.kheyma.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "locations")
public class Location {
    
    @Id
    private String id; // Unique identifier
    
    @NotBlank(message = "Name is required")
    private String name; // Location name shown to user
    
    @NotNull(message = "Latitude is required")
    private Double latitude; // Coordinates
    
    @NotNull(message = "Longitude is required")
    private Double longitude; // Coordinates
    
    private String description; // Optional - shown in popup/details
    
    private LocationType type; // Optional - campsite, shop, point-of-interest
    
    public enum LocationType {
        CAMPSITE,
        SHOP,
        POINT_OF_INTEREST
    }
}