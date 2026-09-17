package com.questbase.backend.notes.location.dto;

import java.time.LocalDateTime;

import com.questbase.backend.notes.location.LocationNotes;

public record LocationNotesResponse(
    Long id,
    Long locationId,
    Long userId,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static LocationNotesResponse from(LocationNotes notes) {
        if (notes == null) {
            return null;
        }

        return new LocationNotesResponse(
            notes.getId(),
            notes.getLocation().getId(), 
            notes.getUser().getId(), 
            notes.getNotes(), 
            notes.getCreatedAt(),
            notes.getUpdatedAt()
        );
    }
}
