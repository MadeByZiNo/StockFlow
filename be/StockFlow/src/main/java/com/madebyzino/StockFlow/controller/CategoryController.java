package com.madebyzino.StockFlow.controller;

import com.madebyzino.StockFlow.dto.category.CategoryRequest;
import com.madebyzino.StockFlow.dto.category.CategoryResponse;
import com.madebyzino.StockFlow.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody @Valid CategoryRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, request);
        return ResponseEntity.ok(response);
    }


    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> getAllCategories(Pageable pageable) {
        Page<CategoryResponse> responsePage = categoryService.getAllCategories(pageable);
        return ResponseEntity.ok(responsePage);
    }

}