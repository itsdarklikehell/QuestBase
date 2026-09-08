package com.questbase.backend.quest.dto;

import java.time.LocalDateTime;

import com.questbase.backend.notes.quest.QuestNotes;
import com.questbase.backend.notes.quest.dto.QuestNotesResponse;
import com.questbase.backend.quest.Quest;
import com.questbase.backend.quest.enums.QuestDifficulty;
import com.questbase.backend.quest.enums.QuestStatus;

import lombok.Builder;

@Builder 
public record QuestDetailsResponse (
    Long id,
    String title,
    String description,
    QuestStatus status,
    QuestDifficulty difficulty,
    Integer rewardXp,
    String notes,
    LocalDateTime createdAt,
    Long campaignId,
    QuestNotesResponse personalNotes
) {
    public static QuestDetailsResponse from(Quest quest, QuestNotes notes) {
        return new QuestDetailsResponse(
            quest.getId(),
            quest.getTitle(),
            quest.getDescription(),
            quest.getStatus(),
            quest.getDifficulty(),
            quest.getRewardXp(),
            quest.getNotes(),
            quest.getCreatedAt(),
            quest.getCampaign().getId(),
            QuestNotesResponse.from(notes)
        );
    }
}
