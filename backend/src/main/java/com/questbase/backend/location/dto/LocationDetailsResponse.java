package com.questbase.backend.location.dto;

import java.time.LocalDateTime;

import com.questbase.backend.location.Location;
import com.questbase.backend.location.enums.LocationStatus;
import com.questbase.backend.location.enums.LocationType;

public record LocationDetailsResponse (
    Long id,
    Long parentId,
    String name,
    String description,
    LocationType type,
    LocationStatus status,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    Long campaignId
) {
    public static LocationDetailsResponse from(Location location) {
        return new LocationDetailsResponse(
            location.getId(),
            location.getParentId(), 
            location.getName(), 
            location.getDescription(), 
            location.getType(), 
            location.getStatus(), 
            location.getNotes(), 
            location.getCreatedAt(), 
            location.getUpdatedAt(),
            location.getCampaign().getId()
        );
    }
}

