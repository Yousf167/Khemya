package com.kheyma.repository;

import com.kheyma.model.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
    List<Location> findByType(Location.LocationType type);
    List<Location> findByNameContainingIgnoreCase(String name);
}