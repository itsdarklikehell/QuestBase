package com.questbase.backend.location;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.location.dto.CreateLocationRequest;
import com.questbase.backend.location.dto.LocationResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(
        LocationService locationService
    ) {
        this.locationService = locationService;
    }

    @GetMapping("/{id}")
    public LocationResponse getLocationById(
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
}
