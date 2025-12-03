package com.madebyzino.StockFlow.repository.mapper;

import com.madebyzino.StockFlow.entity.Location;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface LocationMapper {

    // 1. 목록 조회
    List<Location> findLocationsByCriteria(
            @Param("centerName") String centerName,
            @Param("zone") String zone,
            @Param("isActive") Boolean isActive,
            @Param("limit") int limit,
            @Param("offset") long offset
    );

    // 2. 전체 카운트 조회
    long countLocationsByCriteria(
            @Param("centerName") String centerName,
            @Param("zone") String zone,
            @Param("isActive") Boolean isActive
    );
}