package com.kheyma.controller;

import com.kheyma.dto.TransactionDTO;
import com.kheyma.model.Transaction;
import com.kheyma.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {
    
    private final TransactionService transactionService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Transaction> createTransaction(
            @Valid @RequestBody TransactionDTO transactionDTO,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(transactionService.createTransaction(transactionDTO, userEmail));
    }
    
    @GetMapping("/my-transactions")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<Transaction>> getMyTransactions(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(transactionService.getTransactionsByUserEmail(userEmail));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }
    
    @GetMapping("/my-total-spent")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getMyTotalSpent(Authentication authentication) {
        String userEmail = authentication.getName();
        Double total = transactionService.getTotalRevenueByUser(userEmail);
        
        Map<String, Object> response = new HashMap<>();
        response.put("userEmail", userEmail);
        response.put("totalSpent", total);
        
        return ResponseEntity.ok(response);
    }
    
    // Admin endpoints
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }
    
    @GetMapping("/admin/by-date-range")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getTransactionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(transactionService.getTransactionsByDateRange(startDate, endDate));
    }
    
    @GetMapping("/admin/by-location/{locationId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Transaction>> getTransactionsByLocation(@PathVariable String locationId) {
        return ResponseEntity.ok(transactionService.getTransactionsByLocation(locationId));
    }
    
    @GetMapping("/admin/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTotalRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        Double revenue = transactionService.getTotalRevenueByDateRange(startDate, endDate);
        
        Map<String, Object> response = new HashMap<>();
        response.put("startDate", startDate);
        response.put("endDate", endDate);
        response.put("totalRevenue", revenue);
        
        return ResponseEntity.ok(response);
    }
}