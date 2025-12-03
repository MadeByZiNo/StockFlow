package com.madebyzino.StockFlow.service;

import com.madebyzino.StockFlow.dto.location.ItemInLocationResponse;
import com.madebyzino.StockFlow.dto.location.LocationDetailResponse;
import com.madebyzino.StockFlow.dto.location.LocationRequest;
import com.madebyzino.StockFlow.dto.location.LocationResponse;
import com.madebyzino.StockFlow.entity.Inventory;
import com.madebyzino.StockFlow.entity.Location;
import com.madebyzino.StockFlow.repository.InventoryRepository;
import com.madebyzino.StockFlow.repository.LocationQueryRepository;
import com.madebyzino.StockFlow.repository.LocationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationQueryRepository locationQueryRepository;
    private final InventoryRepository inventoryRepository;

    // 1. 위치 등록
    @Transactional
    public LocationResponse createLocation(LocationRequest request) {
        if (locationRepository.findByCenterNameAndZoneAndBinCode(
                request.getCenterName(), request.getZone(), request.getBinCode()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 센터, 구역, 선반 코드 조합입니다.");
        }

        Location newLocation = Location.builder()
                .centerName(request.getCenterName())
                .zone(request.getZone())
                .binCode(request.getBinCode())
                .isActive(request.getIsActive())
                .build();

        return LocationResponse.of(locationRepository.save(newLocation));
    }

    // 2. 위치 수정
    @Transactional
    public LocationResponse updateLocation(Long id, LocationRequest request) {

        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ID가 " + id + "인 위치를 찾을 수 없습니다."));

        locationRepository.findByCenterNameAndZoneAndBinCode(
                        request.getCenterName(), request.getZone(), request.getBinCode())
                .ifPresent(existingLocation -> {
                    if (!existingLocation.getId().equals(id)) {
                        throw new IllegalArgumentException("수정하려는 위치 정보가 이미 다른 위치에 등록되어 있습니다.");
                    }
                });

        location.update(request.getCenterName(), request.getZone(), request.getBinCode(), request.getIsActive());
        return LocationResponse.of(location);
    }

    // 3. 위치 목록 검색 및 조회 (필터링 적용)
    public Page<LocationResponse> searchLocations(
            String centerName,
            String zone,
            Boolean isActive,
            Pageable pageable) {

        return locationQueryRepository.findLocationsByCriteria(centerName, zone, isActive, pageable)
                .map(LocationResponse::of);
    }

    // 4. 위치 상세 조회 및 재고 목록 반환
    public LocationDetailResponse getLocationDetail(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ID가 " + id + "인 위치를 찾을 수 없습니다."));

        List<Inventory> inventories = inventoryRepository.findByLocation(location);

        List<ItemInLocationResponse> inventoryList = inventories.stream()
                .map(ItemInLocationResponse::of)
                .collect(Collectors.toList());

        return LocationDetailResponse.builder()
                .id(location.getId())
                .centerName(location.getCenterName())
                .zone(location.getZone())
                .binCode(location.getBinCode())
                .isActive(location.isActive())
                .inventoryList(inventoryList)
                .build();
    }

    // 5. 활성화 상태 토글
    @Transactional
    public LocationResponse toggleLocationActivation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("ID가 " + id + "인 위치를 찾을 수 없습니다."));

        location.toggleActive();

        return LocationResponse.of(location);
    }

    public List<String> getAllCenterNames() {
        return locationRepository.findDistinctCenterNames();
    }

    // 7. 특정 센터의 구역(Zone) 목록 조회 (프론트엔드 연동 필터링용)
    public List<String> getZonesByCenterName(String centerName) {
        return locationRepository.findDistinctZonesByCenterName(centerName);
    }
}