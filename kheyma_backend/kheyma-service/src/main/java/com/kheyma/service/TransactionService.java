package com.kheyma.service;

import com.kheyma.aspect.Auditable;
import com.kheyma.dto.TransactionDTO;
import com.kheyma.model.Location;
import com.kheyma.model.Transaction;
import com.kheyma.model.User;
import com.kheyma.repository.LocationRepository;
import com.kheyma.repository.TransactionRepository;
import com.kheyma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TransactionService {
    
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    
    @Auditable
    public Transaction createTransaction(TransactionDTO dto, String userEmail) {
        if (userEmail == null) {
            throw new IllegalArgumentException("User email cannot be null");
        }
        if (dto == null || dto.getLocationId() == null) {
            throw new IllegalArgumentException("Transaction DTO and location ID cannot be null");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String locationId = Objects.requireNonNull(dto.getLocationId(), "Location ID must not be null");
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        
        // Get next transaction ID
        Integer nextTransId = transactionRepository.findTopByOrderByTransIdDesc()
                .map(t -> t.getTransId() + 1)
                .orElse(1);
        
        Transaction transaction = new Transaction();
        transaction.setUserId(user.getId());
        transaction.setTransId(nextTransId);
        transaction.setAmount(dto.getAmount());
        transaction.setPackageType(dto.getPackageType());
        transaction.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        
        // Create location reference
        Transaction.LocationReference locationRef = new Transaction.LocationReference();
        locationRef.setLocationId(location.getId());
        locationRef.setName(location.getName());
        locationRef.setLatitude(location.getLatitude());
        locationRef.setLongitude(location.getLongitude());
        transaction.setLocation(locationRef);
        
        return transactionRepository.save(transaction);
    }
    
    public List<Transaction> getTransactionsByUserEmail(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionRepository.findByUserIdOrderByDateDesc(user.getId());
    }
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }
    
    public Transaction getTransactionById(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Transaction ID cannot be null");
        }
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }
    
    public List<Transaction> getTransactionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return transactionRepository.findByDateBetween(startDate, endDate);
    }
    
    public List<Transaction> getTransactionsByLocation(String locationId) {
        if (locationId == null) {
            throw new IllegalArgumentException("Location ID cannot be null");
        }
        return transactionRepository.findByLocationLocationId(locationId);
    }
    
    public Double getTotalRevenueByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByDateBetween(startDate, endDate);
        return transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
    
    public Double getTotalRevenueByUser(String userEmail) {
        if (userEmail == null) {
            throw new IllegalArgumentException("User email cannot be null");
        }
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Transaction> transactions = transactionRepository.findByUserId(user.getId());
        return transactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
    }
}