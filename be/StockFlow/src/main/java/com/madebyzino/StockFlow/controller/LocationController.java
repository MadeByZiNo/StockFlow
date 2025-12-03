package com.madebyzino.StockFlow.controller;

import com.madebyzino.StockFlow.dto.location.LocationDetailResponse;
import com.madebyzino.StockFlow.dto.location.LocationRequest;
import com.madebyzino.StockFlow.dto.location.LocationResponse;
import com.madebyzino.StockFlow.service.LocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    // 1. 위치 등록
    @PostMapping
    public ResponseEntity<LocationResponse> createLocation(@RequestBody @Valid LocationRequest request) {
        LocationResponse response = locationService.createLocation(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // 2. 위치 수정
    @PutMapping("/{id}")
    public ResponseEntity<LocationResponse> updateLocation(
            @PathVariable Long id,
            @RequestBody @Valid LocationRequest request) {
        LocationResponse response = locationService.updateLocation(id, request);
        return ResponseEntity.ok(response);
    }

    // 3. 위치 목록 검색 및 조회
    @GetMapping
    public ResponseEntity<Page<LocationResponse>> searchLocations(
            @RequestParam(required = false) String centerName,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) Boolean isActive,
            Pageable pageable) {

        Page<LocationResponse> responsePage = locationService.searchLocations(centerName, zone, isActive, pageable);
        return ResponseEntity.ok(responsePage);
    }

    // 4. 위치 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<LocationDetailResponse> getLocationDetail(@PathVariable Long id) {
        LocationDetailResponse response = locationService.getLocationDetail(id);
        return ResponseEntity.ok(response);
    }

    // 5. 활성화 상태 토글
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<LocationResponse> toggleLocationActivation(@PathVariable Long id) {
        LocationResponse response = locationService.toggleLocationActivation(id);
        return ResponseEntity.ok(response);
    }

    // 6. 모든 고유 센터 이름 목록 조회
    @GetMapping("/center-names")
    public ResponseEntity<List<String>> getAllCenterNames() {
        List<String> centerNames = locationService.getAllCenterNames();
        return ResponseEntity.ok(centerNames);
    }

    //  7. 특정 센터에 속한 구역(Zone) 목록 조회
    @GetMapping("/zones-by-center")
    public ResponseEntity<List<String>> getZonesByCenterName(@RequestParam String centerName) {
        List<String> zones = locationService.getZonesByCenterName(centerName);
        return ResponseEntity.ok(zones);
    }
}