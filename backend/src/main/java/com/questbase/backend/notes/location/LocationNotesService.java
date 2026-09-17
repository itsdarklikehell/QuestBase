package com.questbase.backend.notes.location;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.location.Location;
import com.questbase.backend.location.LocationRepository;
import com.questbase.backend.notes.location.dto.CreateLocationNotesRequest;
import com.questbase.backend.notes.location.dto.LocationNotesResponse;

@Service 
public class LocationNotesService {
    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final LocationRepository locationRepository;
    private final LocationNotesRepository locationNotesRepository;

    public LocationNotesService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        LocationRepository locationRepository,
        LocationNotesRepository locationNotesRepository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.locationRepository = locationRepository;
        this.locationNotesRepository = locationNotesRepository;
    }  

    public LocationNotesResponse createLocationNotes(
        Long locationId,
        CreateLocationNotesRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Location location = locationRepository
            .findById(locationId)
            .orElseThrow(() -> new ResourceNotFoundException("Location"));

        campaignAccessService.requireAccess(
            location.getCampaign().getId(), 
            currentUser.getId()
        );

        LocationNotes notes = LocationNotes.builder()
            .location(location)
            .user(currentUser)
            .notes(request.notes())
            .build();

        LocationNotes savedNotes = locationNotesRepository.save(notes);
        return LocationNotesResponse.from(savedNotes);
    }

    public LocationNotesResponse saveLocationNotes(
        Long locationId,
        CreateLocationNotesRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Optional<LocationNotes> existingNotes = locationNotesRepository.findByLocationIdAndUserId(
            locationId,
            currentUser.getId()
        );

        if (existingNotes.isPresent()) {
            LocationNotes locationNotes = existingNotes.get();

            locationNotes.setNotes(request.notes());
            locationNotes.setUpdatedAt(LocalDateTime.now());

            LocationNotes savedNotes = locationNotesRepository.save(locationNotes);
            return LocationNotesResponse.from(savedNotes);
        }

        return createLocationNotes(locationId, request);
    }
}
