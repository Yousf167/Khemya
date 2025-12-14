package com.kheyma.repository;

import com.kheyma.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserId(String userId);
    List<Transaction> findByUserIdOrderByDateDesc(String userId);
    List<Transaction> findByDateBetween(LocalDate startDate, LocalDate endDate);
    Optional<Transaction> findTopByOrderByTransIdDesc(); // Get highest transId
    List<Transaction> findByLocationLocationId(String locationId);
}