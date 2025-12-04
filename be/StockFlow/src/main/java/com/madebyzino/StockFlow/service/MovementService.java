package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.inventory.MovementRequest;
import com.madebyzino.StockFlow.entity.Inventory;
import com.madebyzino.StockFlow.entity.Item;
import com.madebyzino.StockFlow.entity.Location;
import com.madebyzino.StockFlow.entity.Transaction;
import com.madebyzino.StockFlow.entity.user.User;
import com.madebyzino.StockFlow.exception.MovementException;
import com.madebyzino.StockFlow.exception.ResourceNotFoundException;
import com.madebyzino.StockFlow.repository.InventoryRepository;
import com.madebyzino.StockFlow.repository.ItemRepository;
import com.madebyzino.StockFlow.repository.LocationRepository;
import com.madebyzino.StockFlow.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MovementService {

    private final InventoryRepository inventoryRepository;
    private final LocationRepository locationRepository;
    private final TransactionRepository transactionRepository;
    private final ItemRepository itemRepository;

    @Transactional
    public void recordMovement(MovementRequest request, User currentUser) {
        // 1. 기본 검증
        if (request.getQuantity() <= 0) {
            throw new MovementException("이동 수량은 0보다 커야 합니다.");
        }
        if (request.getFromBinCode().equals(request.getToBinCode())) {
            throw new MovementException("출발지와 도착지 위치 코드가 동일할 수 없습니다.");
        }

        // 2. Item, Location 엔티티 조회
        Item item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("품목을 찾을 수 없습니다. ID: " + request.getItemId()));

        Location fromLocation = locationRepository.findByBinCode(request.getFromBinCode())
                .orElseThrow(() -> new MovementException("출발 위치를 찾을 수 없습니다. Code: " + request.getFromBinCode()));

        Location toLocation = locationRepository.findByBinCode(request.getToBinCode())
                .orElseThrow(() -> new MovementException("도착 위치를 찾을 수 없습니다. Code: " + request.getToBinCode()));

        // 3. 재고 차감 (출발지)
        Inventory fromInventory = inventoryRepository.findByItemAndLocation(item, fromLocation)
                .orElseThrow(() -> new ResourceNotFoundException("출발지에 해당 품목 재고가 없습니다."));

        if (fromInventory.getQuantity() < request.getQuantity()) {
            throw new MovementException("출발지(" + fromLocation.getBinCode() + ")의 재고가 부족합니다.");
        }

         fromInventory.removeStock(request.getQuantity());

        Inventory toInventory = inventoryRepository.findByItemAndLocation(item, toLocation)
                .orElseGet(() -> Inventory.builder()
                        .item(item)
                        .location(toLocation)
                        .quantity(0) // 새 위치의 초기 재고는 0
                        .build());

        toInventory.addStock(request.getQuantity());

        inventoryRepository.save(fromInventory);
        inventoryRepository.save(toInventory);

        // 6. Transaction 기록
        Transaction transaction = Transaction.builder()
                .item(item)
                .fromLocation(fromLocation) // 출발지 기록
                .toLocation(toLocation)     // 도착지 기록
                .type(Transaction.TransactionType.MOVEMENT) // 타입: MOVEMENT
                .quantity(request.getQuantity()) // 이동 수량
                .transactionDate(LocalDateTime.now())
                .userId(currentUser.getId())
                .notes(request.getNotes())
                .build();

        transactionRepository.save(transaction);
    }
}