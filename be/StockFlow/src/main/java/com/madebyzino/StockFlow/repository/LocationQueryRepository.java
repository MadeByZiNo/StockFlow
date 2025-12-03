package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.entity.Location;
import com.madebyzino.StockFlow.repository.mapper.LocationMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class LocationQueryRepository {

    private final LocationMapper locationMapper;

    public Page<Location> findLocationsByCriteria(String centerName, String zone, Boolean isActive, Pageable pageable) {

        // 1. MyBatis로 데이터 조회
        List<Location> content = locationMapper.findLocationsByCriteria(
                centerName,
                zone,
                isActive,
                pageable.getPageSize(),
                pageable.getOffset()
        );

        // 2. 카운트 조회 (데이터가 없거나 첫 페이지에 꽉 차지 않으면 쿼리 생략 최적화)
        long total;
        if (content.isEmpty()) {
            total = 0;
        } else if (pageable.getOffset() == 0 && content.size() < pageable.getPageSize()) {
            total = content.size();
        } else {
            total = locationMapper.countLocationsByCriteria(centerName, zone, isActive);
        }

        return new PageImpl<>(content, pageable, total);
    }
}