package com.madebyzino.StockFlow.entity;

import com.madebyzino.StockFlow.entity.user.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Item extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Setter
    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int safetyStock; // 안전 재고 수량

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public void updateInfo(String name, int safetyStock, int price, Category newCategory, String newSku) {
        this.name = name;
        this.safetyStock = safetyStock;
        this.price = price;

        if (!this.category.getId().equals(newCategory.getId())) {
            this.category = newCategory;
            this.sku = newSku;
        }
    }
}