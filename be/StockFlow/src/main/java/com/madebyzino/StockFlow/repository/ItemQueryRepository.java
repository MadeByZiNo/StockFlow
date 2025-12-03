package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.dto.item.ItemSearchCondition;
import com.madebyzino.StockFlow.dto.item.ItemSummaryResponse;
import com.madebyzino.StockFlow.repository.mapper.ItemMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ItemQueryRepository {
    private final ItemMapper itemMapper;

    public Page<ItemSummaryResponse> searchItemsWithInventory(ItemSearchCondition condition, Pageable pageable) {

        List<ItemSummaryResponse> content = itemMapper.searchItems(
                condition,
                pageable.getPageSize(),
                pageable.getOffset()
        );

        long total;
        if (content.size() < pageable.getPageSize() && pageable.getOffset() == 0) {
            total = content.size();
        } else {
            total = itemMapper.countItems(condition);
        }

        return new PageImpl<>(content, pageable, total);
    }
}