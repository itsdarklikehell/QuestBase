package com.questbase.backend.location;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.questbase.backend.auth.User;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByCampaignUser(User user);

    List<Location> findByCampaignId(Long campaignId); 
}
