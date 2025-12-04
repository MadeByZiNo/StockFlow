package com.madebyzino.StockFlow.controller;

import com.madebyzino.StockFlow.dto.inventory.MovementRequest;
import com.madebyzino.StockFlow.entity.user.User;
import com.madebyzino.StockFlow.security.CurrentUser;
import com.madebyzino.StockFlow.service.MovementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class MovementController {

    private final MovementService movementService;

    @PostMapping("/move")
    public ResponseEntity<Void> moveInventory(@RequestBody MovementRequest request,
                                              @CurrentUser User currentUser) {
        movementService.recordMovement(request, currentUser);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}