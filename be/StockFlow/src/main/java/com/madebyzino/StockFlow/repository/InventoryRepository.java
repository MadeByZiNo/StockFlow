package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.entity.Inventory;
import com.madebyzino.StockFlow.entity.Location;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    List<Inventory> findByLocation(Location location);

    @Query("SELECT SUM(i.quantity) FROM Inventory i WHERE i.item.id = :itemId")
    Long countTotalQuantityByItemId(@Param("itemId") Long itemId);

}