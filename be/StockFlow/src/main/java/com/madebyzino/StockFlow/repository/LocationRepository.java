package com.madebyzino.StockFlow.repository;

import com.madebyzino.StockFlow.entity.Location;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByCenterNameAndZoneAndBinCode(String centerName, String zone, String binCode);

    @Query("SELECT DISTINCT l.centerName FROM Location l ORDER BY l.centerName")
    List<String> findDistinctCenterNames();

    // 🎯 2. 특정 센터에 속한 고유한 구역(Zone) 목록을 조회
    @Query("SELECT DISTINCT l.zone FROM Location l WHERE l.centerName = :centerName ORDER BY l.zone")
    List<String> findDistinctZonesByCenterName(@Param("centerName") String centerName);
}