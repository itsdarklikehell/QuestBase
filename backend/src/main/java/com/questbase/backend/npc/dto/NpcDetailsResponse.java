package com.questbase.backend.npc.dto;

import java.time.LocalDateTime;

import com.questbase.backend.notes.npc.NpcNotes;
import com.questbase.backend.notes.npc.dto.NpcNotesResponse;
import com.questbase.backend.npc.Npc;
import com.questbase.backend.npc.enums.NpcRole;
import com.questbase.backend.npc.enums.NpcStatus;

import lombok.Builder;

@Builder
public record NpcDetailsResponse (
    Long id,
    String name,
    String description,
    Integer level,
    NpcStatus status,
    NpcRole role,
    String race,
    String occupation,
    String personality,
    String appearance,
    String notes,
    LocalDateTime createdAt,
    Long campaignId,
    NpcNotesResponse personalNotes
) {
    public static NpcDetailsResponse from(Npc npc, NpcNotes notes) {
        return new NpcDetailsResponse(
            npc.getId(),
            npc.getName(),
            npc.getDescription(),
            npc.getLevel(),
            npc.getStatus(),
            npc.getRole(),
            npc.getRace(),
            npc.getOccupation(),
            npc.getPersonality(),
            npc.getAppearance(),
            npc.getNotes(),
            npc.getCreatedAt(),
            npc.getCampaign().getId(),
            NpcNotesResponse.from(notes)
        );
    }
}