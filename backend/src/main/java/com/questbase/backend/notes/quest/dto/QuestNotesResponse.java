package com.questbase.backend.notes.quest.dto;

import java.time.LocalDateTime;

import com.questbase.backend.notes.quest.QuestNotes;

public record QuestNotesResponse (
    Long id,
    Long npcId,
    Long userId,
    String notes,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static QuestNotesResponse from(QuestNotes notes) {
        if (notes == null) {
            return null;
        }

        return new QuestNotesResponse(
            notes.getId(),
            notes.getQuest().getId(),
            notes.getUser().getId(),
            notes.getNotes(),
            notes.getCreatedAt(),
            notes.getUpdatedAt()
        );
    }
}