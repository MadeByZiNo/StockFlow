package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.category.CategoryRequest;
import com.madebyzino.StockFlow.dto.category.CategoryResponse;
import com.madebyzino.StockFlow.entity.Category;
import com.madebyzino.StockFlow.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // 카테고리 등록
    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepository.findByName(request.getName()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 카테고리 이름입니다: " + request.getName());
        }

        if (categoryRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 코드입니다: " + request.getCode());
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        Category savedCategory = categoryRepository.save(category);
        return CategoryResponse.of(savedCategory);
    }

    // 카테고리 수정
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ID가 " + id + "인 카테고리를 찾을 수 없습니다."));

        // 수정 시, 현재 ID를 제외하고 이름 중복 검사
        if (categoryRepository.existsByNameAndIdNot(request.getName(), id)) {
            throw new IllegalArgumentException("이미 존재하는 카테고리 이름입니다: " + request.getName());
        }

        // 엔티티 내부에서 업데이트 메서드를 호출
        category.update(request.getName(), request.getDescription(), request.getCode());

        return CategoryResponse.of(category);
    }


    // 카테고리 목록 조회
    public Page<CategoryResponse> getAllCategories(Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.findAll(pageable);
        return categoryPage.map(CategoryResponse::of);
    }

}