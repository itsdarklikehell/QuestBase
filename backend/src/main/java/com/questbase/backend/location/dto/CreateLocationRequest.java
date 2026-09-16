package com.questbase.backend.location.dto;

import com.questbase.backend.location.enums.LocationStatus;
import com.questbase.backend.location.enums.LocationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record CreateLocationRequest(
    Long parentId,

    @NotBlank(message = "A name is required.")
    @Size(max = 150, message = "Name must be between 1 and 150 characters.")
    String name,

    String description,
    
    LocationType type,

    LocationStatus status,
    
    @NotNull (message = "A campaign ID is required.")
    @Positive(message = "Campaign ID must be positive")
    Long campaignId
) {}
