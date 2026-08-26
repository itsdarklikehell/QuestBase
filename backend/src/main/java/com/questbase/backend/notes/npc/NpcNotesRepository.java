package com.questbase.backend.notes.npc;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NpcNotesRepository extends JpaRepository<NpcNotes, Long> {

    Optional<NpcNotes> findByNpcIdAndUserId(Long npcId, Long userId);

    Boolean existsByNpcIdAndUserId(Long npcId, Long userId);
}
