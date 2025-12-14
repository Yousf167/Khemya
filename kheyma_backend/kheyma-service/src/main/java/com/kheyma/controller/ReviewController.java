package com.kheyma.controller;

import com.kheyma.dto.ReviewDTO;
import com.kheyma.model.Review;
import com.kheyma.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Review> createReview(
            @Valid @RequestBody ReviewDTO reviewDTO,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reviewService.createReview(reviewDTO, userEmail));
    }
    
    @GetMapping("/campsite/{campsiteId}")
    public ResponseEntity<List<Review>> getReviewsByCampsite(@PathVariable String campsiteId) {
        return ResponseEntity.ok(reviewService.getReviewsByCampsite(campsiteId));
    }
    
    @GetMapping("/my-reviews")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Review>> getMyReviews(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reviewService.getReviewsByUserEmail(userEmail));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Review> updateReview(
            @PathVariable String id,
            @Valid @RequestBody ReviewDTO reviewDTO,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(reviewService.updateReview(id, reviewDTO, userEmail));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> deleteReview(
            @PathVariable String id,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        reviewService.deleteReview(id, userEmail);
        return ResponseEntity.noContent().build();
    }
}