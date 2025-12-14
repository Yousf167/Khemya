package com.kheyma.service;

import com.kheyma.model.Transaction;
import com.kheyma.repository.LocationRepository;
import com.kheyma.repository.ReviewRepository;
import com.kheyma.repository.TransactionRepository;
import com.kheyma.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;
    private final TransactionRepository transactionRepository;
    private final ReviewRepository reviewRepository;
    
    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalLocations", locationRepository.count());
        analytics.put("totalTransactions", transactionRepository.count());
        analytics.put("totalReviews", reviewRepository.count());
        
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        double totalRevenue = allTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
        analytics.put("totalRevenue", totalRevenue);
        
        // This month's transactions
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate endOfMonth = LocalDate.now().withDayOfMonth(
                LocalDate.now().lengthOfMonth()
        );
        
        List<Transaction> monthTransactions = transactionRepository
                .findByDateBetween(startOfMonth, endOfMonth);
        
        double monthRevenue = monthTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
        analytics.put("monthlyRevenue", monthRevenue);
        analytics.put("monthlyTransactions", monthTransactions.size());
        
        return analytics;
    }
    
    public Map<String, Object> getTransactionStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        Map<Transaction.PackageType, Long> transactionsByPackage = allTransactions.stream()
                .collect(Collectors.groupingBy(Transaction::getPackageType, Collectors.counting()));
        stats.put("transactionsByPackage", transactionsByPackage);
        
        Map<String, Long> transactionsByLocation = allTransactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getLocation().getName(),
                        Collectors.counting()
                ));
        stats.put("transactionsByLocation", transactionsByLocation);
        
        // Revenue by package
        Map<Transaction.PackageType, Double> revenueByPackage = allTransactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getPackageType,
                        Collectors.summingDouble(Transaction::getAmount)
                ));
        stats.put("revenueByPackage", revenueByPackage);
        
        return stats;
    }
    
    public Map<String, Object> getRevenueStatistics() {
        Map<String, Object> revenue = new HashMap<>();
        
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        double totalRevenue = allTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .sum();
        revenue.put("totalRevenue", totalRevenue);
        
        // Calculate average transaction amount
        double avgTransaction = allTransactions.stream()
                .mapToDouble(Transaction::getAmount)
                .average()
                .orElse(0.0);
        revenue.put("averageTransactionAmount", avgTransaction);
        
        // Get revenue by month (last 6 months)
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Transaction> recentTransactions = transactionRepository
                .findByDateBetween(sixMonthsAgo, LocalDate.now());
        
        Map<String, Double> revenueByMonth = recentTransactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().getYear() + "-" + String.format("%02d", t.getDate().getMonthValue()),
                        Collectors.summingDouble(Transaction::getAmount)
                ));
        revenue.put("revenueByMonth", revenueByMonth);
        
        return revenue;
    }
    
    public List<Map<String, Object>> getPopularLocations() {
        List<Transaction> allTransactions = transactionRepository.findAll();
        
        Map<String, Long> transactionCounts = allTransactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getLocation().getLocationId(),
                        Collectors.counting()
                ));
        
        Map<String, Double> locationRevenue = allTransactions.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getLocation().getLocationId(),
                        Collectors.summingDouble(Transaction::getAmount)
                ));
        
        return transactionCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("locationId", entry.getKey());
                    item.put("transactionCount", entry.getValue());
                    item.put("revenue", locationRevenue.getOrDefault(entry.getKey(), 0.0));
                    
                    // Get location details from first transaction with this location
                    allTransactions.stream()
                            .filter(t -> t.getLocation().getLocationId().equals(entry.getKey()))
                            .findFirst()
                            .ifPresent(t -> {
                                item.put("name", t.getLocation().getName());
                                item.put("latitude", t.getLocation().getLatitude());
                                item.put("longitude", t.getLocation().getLongitude());
                            });
                    
                    return item;
                })
                .collect(Collectors.toList());
    }
}