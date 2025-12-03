package com.madebyzino.StockFlow.entity;

import com.madebyzino.StockFlow.entity.user.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Category extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(length = 12)
    private String code;

    public void update(String name, String description, String code) {
        this.name = name;
        this.description = description;
        this.code = code;
    }
}