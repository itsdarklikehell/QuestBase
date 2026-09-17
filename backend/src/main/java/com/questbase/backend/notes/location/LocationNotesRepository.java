package com.questbase.backend.notes.location;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationNotesRepository extends JpaRepository<LocationNotes, Long> {
    Optional<LocationNotes> findByLocationIdAndUserId(Long locationId, Long userId);
}
