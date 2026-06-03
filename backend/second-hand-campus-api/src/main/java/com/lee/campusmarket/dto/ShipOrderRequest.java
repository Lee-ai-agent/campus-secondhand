package com.lee.campusmarket.dto;

import jakarta.validation.constraints.NotBlank;

public record ShipOrderRequest(@NotBlank String shipType, String logisticsNo, String pickupRemark, String shipRemark) {
    public String normalizedShipType() {
        if ("PICKUP".equalsIgnoreCase(shipType)) {
            return "pickup";
        }
        if ("EXPRESS".equalsIgnoreCase(shipType)) {
            return "express";
        }
        return shipType == null ? null : shipType.toLowerCase();
    }

    public String normalizedLogisticsNo() {
        return logisticsNo;
    }

    public String normalizedPickupRemark() {
        return pickupRemark == null ? shipRemark : pickupRemark;
    }
}
