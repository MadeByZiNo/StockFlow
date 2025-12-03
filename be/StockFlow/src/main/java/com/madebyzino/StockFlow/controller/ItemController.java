package com.madebyzino.StockFlow.controller;

import com.madebyzino.StockFlow.dto.item.ItemRegistrationRequest;
import com.madebyzino.StockFlow.dto.item.ItemResponse;
import com.madebyzino.StockFlow.dto.item.ItemSearchCondition;
import com.madebyzino.StockFlow.dto.item.ItemSummaryResponse;
import com.madebyzino.StockFlow.entity.Item;
import com.madebyzino.StockFlow.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemResponse> getItem(@PathVariable Long itemId) {
        ItemResponse response = itemService.getItemDetail(itemId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ItemResponse> registerItem(@RequestBody ItemRegistrationRequest request) {
        Item item = itemService.registerItem(request);

        return new ResponseEntity<>(ItemResponse.from(item), HttpStatus.CREATED);
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ItemResponse> updateItem(
            @PathVariable Long itemId,
            @RequestBody ItemRegistrationRequest request) {

        Item updatedItem = itemService.updateItem(itemId, request);

        return ResponseEntity.ok(ItemResponse.from(updatedItem));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemId) {
        itemService.deleteItem(itemId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ItemSummaryResponse>> searchItems(
            @ModelAttribute ItemSearchCondition condition,
            Pageable pageable) {

        Page<ItemSummaryResponse> responsePage = itemService.searchItems(condition, pageable);
        return ResponseEntity.ok(responsePage);
    }
}