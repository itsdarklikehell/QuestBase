package com.questbase.backend.location;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.location.dto.CreateLocationRequest;
import com.questbase.backend.location.dto.LocationDetailsResponse;
import com.questbase.backend.location.dto.LocationResponse;
import com.questbase.backend.notes.location.LocationNotes;
import com.questbase.backend.notes.location.LocationNotesRepository;

@Service 
public class LocationService {
  
    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final CampaignRepository campaignRepository;
    private final LocationRepository locationRepository;
    private final LocationNotesRepository locationNotesRepository;

    public LocationService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        CampaignRepository campaignRepository,
        LocationRepository locationRepository,
        LocationNotesRepository locationNotesRepository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.campaignRepository = campaignRepository;
        this.locationRepository = locationRepository;
        this.locationNotesRepository = locationNotesRepository;
    }

    public LocationDetailsResponse getLocationById(Long id) {
        User currentUser = authService.getCurrentUser();

        Location location = locationRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Location"));

        campaignAccessService.requireAccess(
            location.getCampaign().getId(),
            currentUser.getId()
        );
        
        LocationNotes personalNotes = locationNotesRepository
            .findByLocationIdAndUserId(id, currentUser.getId())
            .orElse(null);

        return LocationDetailsResponse.from(location, personalNotes);
    }

    public List<LocationResponse> getAllLocations() {
        User currentUser = authService.getCurrentUser();

        List<Location> locations = locationRepository.findByCampaignUser(currentUser);

        return locations.stream()
            .map(location -> LocationResponse.from(location))
            .toList();
    }

    public List<LocationResponse> getLocationsByCampaignId(Long campaignId) {
        User currentUser = authService.getCurrentUser();

        campaignAccessService.requireAccess(
            campaignId,
            currentUser.getId()
        );

        List<Location> locations = locationRepository.findByCampaignId(campaignId); 

        return locations.stream()
            .map(location -> LocationResponse.from(location))
            .toList();
    }

    public LocationResponse createLocation(CreateLocationRequest request) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(request.campaignId(), currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Location location = Location.builder()
            .parentId(null)
            .name(request.name())
            .description(request.description())
            .type(request.type())
            .status(request.status())
            .campaign(campaign)
            .build();

        Location savedLocation = locationRepository.save(location);
        return LocationResponse.from(savedLocation);
    }

    public LocationDetailsResponse updateLocation(
        Long id, 
        CreateLocationRequest req
    ) {
        User currentUser = authService.getCurrentUser();

        Location location = locationRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("Location"));

        location.setName(req.name());
        location.setDescription(req.description());
        location.setType(req.type());
        location.setStatus(req.status());
        location.setUpdatedAt(LocalDateTime.now());

        Location savedLocation = locationRepository.save(location);

        LocationNotes personalNotes = locationNotesRepository
            .findByLocationIdAndUserId(id, currentUser.getId())
            .orElse(null);

        return LocationDetailsResponse.from(savedLocation, personalNotes);
    }

    public void deleteLocation(Long id) {
        User currentUser = authService.getCurrentUser();

        Location location = locationRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("Location"));

        locationRepository.delete(location);
    }

    public LocationDetailsResponse saveNotesById(Long id, String notes) {
        User currentUser = authService.getCurrentUser();

        Location location = locationRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new ResourceNotFoundException("Location"));

        location.setNotes(notes);
        location.setUpdatedAt(LocalDateTime.now());

        Location savedLocation = locationRepository.save(location);

        LocationNotes personalNotes = locationNotesRepository
            .findByLocationIdAndUserId(id, currentUser.getId())
            .orElse(null);

        return LocationDetailsResponse.from(savedLocation, personalNotes);
    }
}
