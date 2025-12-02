package com.madebyzino.StockFlow.entity;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    private OrderRequest orderRequest;

    @ManyToOne(fetch = FetchType.LAZY)
    private Product product;

    private int quantity;
}
