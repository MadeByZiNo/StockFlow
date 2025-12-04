package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.dto.inventory.InventorySearchCondition;
import com.madebyzino.StockFlow.dto.inventory.InventorySummaryResponse;
import com.madebyzino.StockFlow.repository.mapper.InventoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class InventoryQueryRepository {
    private final InventoryMapper inventoryMapper;

    public Page<InventorySummaryResponse> searchInventoryStatus(InventorySearchCondition condition, Pageable pageable) {

        List<InventorySummaryResponse> content = inventoryMapper.searchInventory(
                condition,
                pageable.getPageSize(),
                pageable.getOffset()
        );

        long total;

        if (content.size() < pageable.getPageSize() && pageable.getOffset() == 0) {
            total = content.size();
        } else {
            total = inventoryMapper.countInventory(condition);
        }

        return new PageImpl<>(content, pageable, total);
    }
}