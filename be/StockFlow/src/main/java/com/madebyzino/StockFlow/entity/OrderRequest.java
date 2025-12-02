package com.madebyzino.StockFlow.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest extends BaseEntity {

    @Enumerated(EnumType.STRING)
    private OrderStatus status; // REQUESTED, APPROVED, REJECTED, CANCELLED

    @ManyToOne(fetch = FetchType.LAZY)
    private User requestedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    private User approvedBy;

    @OneToMany(mappedBy = "orderRequest", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
