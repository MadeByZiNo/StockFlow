package com.madebyzino.StockFlow.entity;

import com.madebyzino.StockFlow.entity.user.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"item_id", "location_id"})
        }
)
public class Inventory extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Setter
    @Column(nullable = false)
    private int quantity;

    public void addStock(int count) {
        if (count < 0) {
            throw new IllegalArgumentException("추가 수량은 0 이상이어야 합니다.");
        }
        this.quantity += count;
    }

    public void removeStock(int count) {
        if (count < 0) {
            throw new IllegalArgumentException("제거 수량은 0 이상이어야 합니다.");
        }
        if (this.quantity < count) {
            throw new IllegalStateException("재고 부족입니다.");
        }
        this.quantity -= count;
    }
}