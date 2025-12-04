package com.madebyzino.StockFlow.controller;

import com.madebyzino.StockFlow.dto.inventory.InventorySearchCondition;
import com.madebyzino.StockFlow.dto.inventory.InventorySummaryResponse;
import com.madebyzino.StockFlow.repository.InventoryQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryQueryRepository inventoryQueryRepository;

    @GetMapping("/status")
    public ResponseEntity<Page<InventorySummaryResponse>> getInventoryStatus(
            InventorySearchCondition condition,

            @PageableDefault(size = 20, sort = "itemId") Pageable pageable)
    {
        Page<InventorySummaryResponse> result = inventoryQueryRepository.searchInventoryStatus(condition, pageable);
        return ResponseEntity.ok(result);
    }
}