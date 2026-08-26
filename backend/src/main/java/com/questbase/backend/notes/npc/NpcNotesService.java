package com.questbase.backend.notes.npc;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.notes.npc.dto.CreateNpcNotesRequest;
import com.questbase.backend.notes.npc.dto.NpcNotesResponse;
import com.questbase.backend.npc.Npc;
import com.questbase.backend.npc.NpcRepository;

@Service
public class NpcNotesService {
    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final NpcRepository npcRepository;
    private final NpcNotesRepository npcNotesRepository;

    public NpcNotesService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        NpcRepository npcRepository,
        NpcNotesRepository npcNotesRepository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.npcRepository = npcRepository;
        this.npcNotesRepository = npcNotesRepository;
    }

    public NpcNotesResponse createNpcNotes(
        Long npcId,
        CreateNpcNotesRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository.findById(npcId)
            .orElseThrow(() -> new ResourceNotFoundException("NPC"));

        campaignAccessService.requireAccess(
            npc.getCampaign().getId(),
            currentUser.getId()
        );

        NpcNotes notes = NpcNotes.builder()
            .npc(npc)
            .user(currentUser)
            .notes(request.notes())
            .build();

        NpcNotes savedNotes = npcNotesRepository.save(notes);
        return NpcNotesResponse.from(savedNotes);
    }

    public NpcNotesResponse saveNpcNotes(
        Long npcId,
        CreateNpcNotesRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Optional<NpcNotes> existingNotes = npcNotesRepository.findByNpcIdAndUserId(
            npcId, 
            currentUser.getId()
        );

        if (existingNotes.isPresent()) {
            NpcNotes npcNotes = existingNotes.get();

            npcNotes.setNotes(request.notes());
            npcNotes.setUpdatedAt(LocalDateTime.now());

            NpcNotes savedNotes = npcNotesRepository.save(npcNotes);
            return NpcNotesResponse.from(savedNotes);
        }

        return createNpcNotes(npcId, request);
    }
}
