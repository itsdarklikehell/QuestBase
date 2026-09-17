package com.questbase.backend.location;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.auth.User;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByCampaignUser(User user);

    List<Location> findByCampaignId(Long campaignId); 

    Optional<Location> findByIdAndCampaignUser(Long id, User user);
}
