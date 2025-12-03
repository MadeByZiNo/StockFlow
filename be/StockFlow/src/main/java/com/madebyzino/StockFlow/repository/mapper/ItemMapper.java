package com.madebyzino.StockFlow.repository.mapper;

import com.madebyzino.StockFlow.dto.item.ItemSearchCondition;
import com.madebyzino.StockFlow.dto.item.ItemSummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItemMapper {
    // 검색 목록 조회
    List<ItemSummaryResponse> searchItems(
            @Param("cond") ItemSearchCondition condition,
            @Param("limit") int limit,
            @Param("offset") long offset
    );

    // 전체 개수 조회 (페이징용)
    long countItems(@Param("cond") ItemSearchCondition condition);
}