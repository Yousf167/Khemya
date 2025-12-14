package com.kheyma.dto;

import com.kheyma.model.Transaction;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    @NotNull(message = "Location ID is required")
    private String locationId;
    
    @NotNull(message = "Amount is required")
    private Double amount;
    
    @NotNull(message = "Package type is required")
    private Transaction.PackageType packageType;
    
    private LocalDate date;
}