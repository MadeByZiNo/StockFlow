package com.madebyzino.StockFlow.entity;

import com.madebyzino.StockFlow.entity.user.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"centerName", "zone", "binCode"})
        }
)
public class Location extends BaseEntity {

    @Column(nullable = false, length = 50)
    private String centerName;

    @Column(nullable = false, length = 30)
    private String zone;

    @Column(nullable = false, length = 30, unique = true)
    private String binCode;

    @Column(nullable = false)
    private boolean isActive;

    public void update(String centerName, String zone, String binCode, boolean isActive) {
        this.centerName = centerName;
        this.zone = zone;
        this.binCode = binCode;
        this.isActive = isActive;
    }

    public boolean toggleActive() {
        this.isActive = !this.isActive;
        return this.isActive;
    }
}