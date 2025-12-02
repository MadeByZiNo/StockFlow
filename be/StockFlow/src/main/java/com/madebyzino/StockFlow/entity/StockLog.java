package com.madebyzino.StockFlow.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockLog extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private StockLogType type; // INBOUND, OUTBOUND, ADJUST

    private int quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
