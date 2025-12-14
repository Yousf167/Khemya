package com.kheyma.service;

import com.kheyma.aspect.Auditable;
import com.kheyma.dto.ReviewDTO;
import com.kheyma.model.Review;
import com.kheyma.model.User;
import com.kheyma.repository.ReviewRepository;
import com.kheyma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    
    @Auditable
    public Review createReview(ReviewDTO dto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if user already reviewed this campsite
        boolean alreadyReviewed = reviewRepository
                .existsByUserIdAndCampsiteId(user.getId(), dto.getCampsiteId());
        
        if (alreadyReviewed) {
            throw new RuntimeException("You have already reviewed this campsite");
        }
        
        Review review = new Review();
        review.setUserId(user.getId());
        review.setUserName(user.getEmail());
        review.setCampsiteId(dto.getCampsiteId());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());
        review.setUpdatedAt(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }
    
    public List<Review> getReviewsByCampsite(String campsiteId) {
        return reviewRepository.findByCampsiteIdOrderByCreatedAtDesc(campsiteId);
    }
    
    public List<Review> getReviewsByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
    
    @Auditable
    public Review updateReview(String id, ReviewDTO dto, String userEmail) {
        if (id == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        if (userEmail == null) {
            throw new IllegalArgumentException("User email cannot be null");
        }
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!review.getUserId().equals(user.getId()) && 
            user.getType() != User.UserType.ADMIN) {
            throw new RuntimeException("You can only update your own reviews");
        }
        
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setUpdatedAt(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }
    
    @Auditable
    public void deleteReview(String id, String userEmail) {
        if (id == null) {
            throw new IllegalArgumentException("Review ID cannot be null");
        }
        if (userEmail == null) {
            throw new IllegalArgumentException("User email cannot be null");
        }
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!review.getUserId().equals(user.getId()) && 
            user.getType() != User.UserType.ADMIN) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        reviewRepository.delete(review);
    }
}