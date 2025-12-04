package com.madebyzino.StockFlow.repository.mapper;

import com.madebyzino.StockFlow.dto.item.ItemSearchCondition;
import com.madebyzino.StockFlow.dto.item.ItemSummaryResponse;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ItemMapper {
    List<ItemSummaryResponse> searchItems(
            @Param("cond") ItemSearchCondition condition,
            @Param("limit") int limit,
            @Param("offset") long offset
    );

    long countItems(@Param("cond") ItemSearchCondition condition);
}