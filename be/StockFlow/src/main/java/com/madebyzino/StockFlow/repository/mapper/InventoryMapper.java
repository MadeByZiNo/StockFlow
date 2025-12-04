package com.madebyzino.StockFlow.repository.mapper;

import com.madebyzino.StockFlow.dto.inventory.InventorySearchCondition;
import com.madebyzino.StockFlow.dto.inventory.InventorySummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InventoryMapper {
    // 재고 현황 (위치별 상세) 검색 목록 조회
    List<InventorySummaryResponse> searchInventory(
            @Param("cond") InventorySearchCondition condition,
            @Param("limit") int limit,
            @Param("offset") long offset
    );

    // 재고 현황 (위치별 상세) 전체 개수 조회 (페이징용)
    long countInventory(@Param("cond") InventorySearchCondition condition);
}