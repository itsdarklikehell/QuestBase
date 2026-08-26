package com.questbase.backend.notes.npc.dto;

import java.time.LocalDateTime;

import com.questbase.backend.notes.npc.NpcNotes;

public record NpcNotesResponse(
    Long id,
    Long npcId,
    Long userId,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static NpcNotesResponse from(NpcNotes notes) {
        if (notes == null) {
            return null;
        }

        return new NpcNotesResponse(
            notes.getId(),
            notes.getNpc().getId(),
            notes.getUser().getId(),
            notes.getNotes(),
            notes.getCreatedAt(),
            notes.getUpdatedAt()
        );
    }
}
