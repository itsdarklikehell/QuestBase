package com.questbase.backend.notes.npc.dto;

import lombok.Builder;

@Builder
public record CreateNpcNotesRequest(
    String notes
) {}
