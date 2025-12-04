package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.inventory.AdjustmentRequest;
import com.madebyzino.StockFlow.entity.Inventory;
import com.madebyzino.StockFlow.entity.Transaction;
import com.madebyzino.StockFlow.entity.user.User;
import com.madebyzino.StockFlow.exception.ResourceNotFoundException;
import com.madebyzino.StockFlow.repository.InventoryRepository;
import com.madebyzino.StockFlow.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdjustmentService {

    private final InventoryRepository inventoryRepository;
    private final TransactionRepository transactionRepository;

    @Transactional
    public void recordAdjustment(AdjustmentRequest request, User currentUser) {

        // 1. 조정 대상 Inventory 엔티티 조회
        Inventory inventory = inventoryRepository.findById(request.getInventoryId())
                .orElseThrow(() -> new ResourceNotFoundException(request.getInventoryId()+"를 찾을 수 없습니다."));

        // 2. 재고 수량 업데이트
        int newQuantity = inventory.getQuantity() + request.getAdjustmentQuantity();
        if (newQuantity < 0) {
            throw new IllegalArgumentException("재고수량은 0보다 커야합니다.");
        }

        inventory.setQuantity(newQuantity);

        inventoryRepository.save(inventory);

        // 3. Transaction 기록
        Transaction transaction = Transaction.builder()
                .item(inventory.getItem())
                .fromLocation(inventory.getLocation())
                .toLocation(inventory.getLocation())
                .type(Transaction.TransactionType.ADJUSTMENT)
                .quantity(request.getAdjustmentQuantity())
                .transactionDate(LocalDateTime.now())
                .userId(currentUser.getId())
                .notes(request.getNotes())
                .build();

        transactionRepository.save(transaction);
    }
}