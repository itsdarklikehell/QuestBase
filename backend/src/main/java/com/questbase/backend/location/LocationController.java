package com.questbase.backend.location;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.location.dto.CreateLocationRequest;
import com.questbase.backend.location.dto.LocationDetailsResponse;
import com.questbase.backend.location.dto.LocationResponse;
import com.questbase.backend.location.dto.SaveLocationNotesRequest;
import com.questbase.backend.notes.location.LocationNotesService;
import com.questbase.backend.notes.location.dto.CreateLocationNotesRequest;
import com.questbase.backend.notes.location.dto.LocationNotesResponse;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;
    private final LocationNotesService locationNotesService;

    public LocationController(
        LocationService locationService,
        LocationNotesService locationNotesService
    ) {
        this.locationService = locationService;
        this.locationNotesService = locationNotesService;
    }

    @GetMapping("/{id}")
    public LocationDetailsResponse getLocationById(
        @PathVariable Long id
    ) {
        return locationService.getLocationById(id);
    }

    @GetMapping()
    public List<LocationResponse> getAllLocations() {
        return locationService.getAllLocations();
    }

    @PostMapping()
    public LocationResponse createLocation(
        @Valid @RequestBody CreateLocationRequest request
    ) {
        return locationService.createLocation(request);
    }

    @PutMapping("/{id}")
    public LocationDetailsResponse updateLocation(
        @PathVariable Long id, 
        @RequestBody CreateLocationRequest request
    ) {
        return locationService.updateLocation(id, request);
    }

    @DeleteMapping ("/{id}")
    public void deleteLocation(
        @PathVariable Long id
    ) {
        locationService.deleteLocation(id);
    }

    @PatchMapping("/{id}/save-notes")
    public LocationDetailsResponse saveLocationNotes(
        @PathVariable Long id,
        @RequestBody SaveLocationNotesRequest request
    ) {
        return locationService.saveNotesById(id, request.notes());
    }

    @PatchMapping("/{id}/save-personal-notes")
    public LocationNotesResponse saveLocationPersonalNotes(
        @PathVariable Long id,
        @RequestBody CreateLocationNotesRequest request
    ) {
        return locationNotesService.saveLocationNotes(id, request);
    }
}
