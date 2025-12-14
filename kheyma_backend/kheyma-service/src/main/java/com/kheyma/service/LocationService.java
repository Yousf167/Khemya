package com.kheyma.service;

import com.kheyma.aspect.Auditable;
import com.kheyma.dto.LocationDTO;
import com.kheyma.model.Location;
import com.kheyma.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class LocationService {
    
    private final LocationRepository locationRepository;
    
    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }
    
    public Location getLocationById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Location ID cannot be null");
        }
        return locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
    }
    
    public List<Location> getLocationsByType(Location.LocationType type) {
        return locationRepository.findByType(type);
    }
    
    public List<Location> searchLocationsByName(String name) {
        return locationRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Auditable
    public Location createLocation(LocationDTO dto) {
        Location location = new Location();
        mapDtoToEntity(dto, location);
        return locationRepository.save(location);
    }
    
    @Auditable
    public Location updateLocation(String id, LocationDTO dto) {
        if (id == null) {
            throw new IllegalArgumentException("Location ID cannot be null");
        }
        Location location = Objects.requireNonNull(getLocationById(id), "Location must not be null");
        mapDtoToEntity(dto, location);
        return locationRepository.save(location);
    }
    
    @Auditable
    public void deleteLocation(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Location ID cannot be null");
        }
        Location location = Objects.requireNonNull(getLocationById(id), "Location must not be null");
        locationRepository.delete(location);
    }
    
    private void mapDtoToEntity(LocationDTO dto, Location location) {
        location.setName(dto.getName());
        location.setLatitude(dto.getLatitude());
        location.setLongitude(dto.getLongitude());
        location.setDescription(dto.getDescription());
        location.setType(dto.getType());
    }
}