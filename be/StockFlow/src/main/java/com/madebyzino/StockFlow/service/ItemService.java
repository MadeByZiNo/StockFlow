package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.item.ItemRegistrationRequest;
import com.madebyzino.StockFlow.dto.item.ItemResponse;
import com.madebyzino.StockFlow.dto.item.ItemSearchCondition;
import com.madebyzino.StockFlow.dto.item.ItemSummaryResponse;
import com.madebyzino.StockFlow.entity.Category;
import com.madebyzino.StockFlow.entity.Item;
import com.madebyzino.StockFlow.exception.ResourceNotFoundException;
import com.madebyzino.StockFlow.repository.CategoryRepository;
import com.madebyzino.StockFlow.repository.InventoryRepository;
import com.madebyzino.StockFlow.repository.ItemQueryRepository;
import com.madebyzino.StockFlow.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final InventoryRepository inventoryRepository;
    private final ItemQueryRepository itemQueryRepository;


    @Transactional(readOnly = true)
    public ItemResponse getItemDetail(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다."));

        return ItemResponse.from(item);
    }

    @Transactional
    public Item registerItem(ItemRegistrationRequest dto) {

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("카테고리가 존재하지 않습니다."));

        Item newItem = Item.builder()
                .name(dto.getName())
                .safetyStock(dto.getSafetyStock())
                .price(dto.getPrice())
                .category(category)
                .sku("")
                .build();

        Item savedItem = itemRepository.save(newItem);

        String sku = generateSku(category.getCode(), savedItem.getId());
        savedItem.setSku(sku);

        return savedItem;
    }

    @Transactional
    public Item updateItem(Long itemId, ItemRegistrationRequest dto) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 상품이 존재하지 않습니다 : " + itemId));

        Category newCategory = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("카테고리가 존재하지 않습니다."));

        String updatedSku = item.getSku(); // 기본값: 기존 SKU

        if (!item.getCategory().getId().equals(newCategory.getId())) {
            updatedSku = generateSku(newCategory.getCode(), item.getId());
        }

        item.updateInfo(
                dto.getName(),
                dto.getSafetyStock(),
                dto.getPrice(),
                newCategory,
                updatedSku
        );

        return item;
    }

    @Transactional
    public void deleteItem(Long itemId) {
        Long totalStock = inventoryRepository.countTotalQuantityByItemId(itemId);

        if (totalStock > 0) {
            throw new IllegalStateException("재고가 남아 있는 품목은 삭제할 수 없습니다. 현재 재고 수량: " + totalStock);
        }

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("해당 상품이 존재하지 않습니다 : " + itemId));

        itemRepository.delete(item);
    }

    @Transactional(readOnly = true)
    public Page<ItemSummaryResponse> searchItems(ItemSearchCondition condition, Pageable pageable) {
        return itemQueryRepository.searchItemsWithInventory(condition, pageable);
    }

    private String generateSku(String categoryCode, Long itemId) {
        return categoryCode + itemId;
    }

}