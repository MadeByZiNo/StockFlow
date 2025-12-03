package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // 카테고리 이름으로 중복을 확인
    Optional<Category> findByName(String name);

    Optional<Category> findByCode(String name);

    // 수정 시, 특정 ID를 제외하고 이름 중복을 확인
    boolean existsByNameAndIdNot(String name, Long id);
}