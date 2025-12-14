package com.kheyma.controller;

import com.kheyma.dto.LocationDTO;
import com.kheyma.model.Location;
import com.kheyma.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {
    
    private final LocationService locationService;
    
    // Public endpoints
    @GetMapping("/public/all")
    public ResponseEntity<List<Location>> getAllLocations() {
        return ResponseEntity.ok(locationService.getAllLocations());
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<Location> getLocationById(@PathVariable String id) {
        return ResponseEntity.ok(locationService.getLocationById(id));
    }
    
    @GetMapping("/public/search")
    public ResponseEntity<List<Location>> searchLocations(@RequestParam String name) {
        return ResponseEntity.ok(locationService.searchLocationsByName(name));
    }
    
    @GetMapping("/public/type/{type}")
    public ResponseEntity<List<Location>> getLocationsByType(@PathVariable Location.LocationType type) {
        return ResponseEntity.ok(locationService.getLocationsByType(type));
    }
    
    // Admin endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Location> createLocation(@Valid @RequestBody LocationDTO locationDTO) {
        return ResponseEntity.ok(locationService.createLocation(locationDTO));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Location> updateLocation(
            @PathVariable String id,
            @Valid @RequestBody LocationDTO locationDTO
    ) {
        return ResponseEntity.ok(locationService.updateLocation(id, locationDTO));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLocation(@PathVariable String id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}