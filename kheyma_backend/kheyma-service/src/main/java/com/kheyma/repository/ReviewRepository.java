package com.kheyma.repository;

import com.kheyma.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByCampsiteIdOrderByCreatedAtDesc(String campsiteId);
    List<Review> findByUserIdOrderByCreatedAtDesc(String userId);
    boolean existsByUserIdAndCampsiteId(String userId, String campsiteId);
}