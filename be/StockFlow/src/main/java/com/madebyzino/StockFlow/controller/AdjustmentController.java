package com.madebyzino.StockFlow.controller;

import com.madebyzino.StockFlow.dto.inventory.AdjustmentRequest;
import com.madebyzino.StockFlow.entity.user.User;
import com.madebyzino.StockFlow.security.CurrentUser;
import com.madebyzino.StockFlow.service.AdjustmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class AdjustmentController {

    private final AdjustmentService adjustmentService;

    @PostMapping("/adjust")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> adjustInventory(@RequestBody AdjustmentRequest request,
                                                @CurrentUser User currentUser
    ) {
        adjustmentService.recordAdjustment(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}