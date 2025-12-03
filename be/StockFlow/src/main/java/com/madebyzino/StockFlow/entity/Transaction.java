package com.madebyzino.StockFlow.entity;

import com.madebyzino.StockFlow.entity.user.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Transaction extends BaseEntity {

    public enum TransactionType {
        INBOUND,    // 입고
        OUTBOUND,   // 출고
        MOVEMENT    // 재고 이동
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_location_id")
    private Location fromLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_location_id")
    private Location toLocation;

    // Transaction Details
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private int quantity; // 변화 수량

    @Column(nullable = false)
    private LocalDateTime transactionDate; // 거래 발생 시점

    // User ID는 User 엔티티가 있다고 가정하고 Long 타입만 남겨둠
    @Column(nullable = false)
    private Long userId; // 작업자 ID

    private String notes; // 비고
}