package com.questbase.backend.notes.quest;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestNotesRepository extends JpaRepository<QuestNotes, Long> {
    Optional<QuestNotes> findByQuestIdAndUserId(Long questId, Long userId);

    Boolean existsByQuestIdAndUserId(Long questId, Long userId);
}
