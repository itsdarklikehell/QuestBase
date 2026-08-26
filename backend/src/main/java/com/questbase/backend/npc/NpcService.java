package com.questbase.backend.npc;

import java.util.List;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.campaign.CampaignRepository;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.notes.npc.NpcNotes;
import com.questbase.backend.notes.npc.NpcNotesRepository;
import com.questbase.backend.npc.dto.CreateNpcRequest;
import com.questbase.backend.npc.dto.NpcDetailsResponse;
import com.questbase.backend.npc.dto.NpcQuestResponse;
import com.questbase.backend.npc.dto.NpcResponse;
import com.questbase.backend.relationship.questnpc.QuestNpc;
import com.questbase.backend.relationship.questnpc.QuestNpcRepository;

@Service
public class NpcService {
    
    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final CampaignRepository campaignRepository;
    private final NpcRepository npcRepository;
    private final NpcNotesRepository npcNotesRepository;
    private final QuestNpcRepository questNpcRepository;

    public NpcService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        CampaignRepository campaignRepository,
        NpcRepository npcRepository,
        NpcNotesRepository npcNotesRepository,
        QuestNpcRepository questNpcRepository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.campaignRepository = campaignRepository;
        this.npcRepository = npcRepository;
        this.npcNotesRepository = npcNotesRepository;
        this.questNpcRepository = questNpcRepository;
    }

    public NpcDetailsResponse getNpcById(Long id) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("NPC"));

        campaignAccessService.requireAccess(
            npc.getCampaign().getId(),
            currentUser.getId()
        );

        NpcNotes notes = npcNotesRepository.findByNpcIdAndUserId(
            npc.getId(), 
            currentUser.getId()
        ).orElse(null);

        return NpcDetailsResponse.from(npc, notes);
    }

    public List<NpcResponse> getAllNpcs() {
        User currentUser = authService.getCurrentUser();

        List<Npc> npcs = npcRepository.findByCampaignUser(currentUser);

        return npcs.stream()
            .map(npc -> NpcResponse.from(npc))
            .toList();
    }

    public NpcResponse createNpc(CreateNpcRequest request) {
        User currentUser = authService.getCurrentUser();

        Campaign campaign = campaignRepository.findByIdAndUser(request.campaignId(), currentUser)
            .orElseThrow(() -> new RuntimeException("Campaign not found"));

        Npc npc = Npc.builder()
            .name(request.name())
            .description(request.description())
            .level(request.level())
            .status(request.status())
            .role(request.role())
            .race(request.race())
            .occupation(request.occupation())
            .personality(request.personality())
            .appearance(request.appearance())
            .notes(request.notes())
            .campaign(campaign)
            .build();

        Npc savedNpc = npcRepository.save(npc);
        return NpcResponse.from(savedNpc);
    }

    public List<NpcResponse> getNpcsByCampaignId(
        Long campaignId,
        String sort
    ) {
        User currentUser = authService.getCurrentUser();

        campaignAccessService.requireAccess(
            campaignId,
            currentUser.getId()
        );

        List<Npc> npcs;
        if ("asc".equalsIgnoreCase(sort)) {
            npcs = npcRepository
                .findByCampaignIdOrderByCreatedAtAsc(campaignId);
        } else {
            npcs = npcRepository
                .findByCampaignIdOrderByCreatedAtDesc(campaignId);
        }

        return npcs.stream()
            .map(npc -> NpcResponse.from(npc))
            .toList();
    }

    public NpcDetailsResponse updateNpc(
        Long id,
        CreateNpcRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        npc.setName(request.name());
        npc.setDescription(request.description());
        npc.setLevel(request.level());
        npc.setStatus(request.status());
        npc.setRole(request.role());
        npc.setRace(request.race());
        npc.setOccupation(request.occupation());
        npc.setPersonality(request.personality());
        npc.setAppearance(request.appearance());

        Npc savedNpc = npcRepository.save(npc);

        NpcNotes notes = npcNotesRepository.findByNpcIdAndUserId(
            npc.getId(), 
            currentUser.getId()
        ).orElse(null);

        return NpcDetailsResponse.from(savedNpc, notes);
    }

    public void deleteNpc(Long id) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        npcRepository.delete(npc);
    }

    public NpcDetailsResponse saveNpcNotesById(
        Long id,
        String notes
    ) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository
            .findByIdAndCampaignUser(id, currentUser)
            .orElseThrow(() -> new RuntimeException("NPC not found"));

        npc.setNotes(notes);

        Npc savedNpc = npcRepository.save(npc);

        NpcNotes npcNotes = npcNotesRepository.findByNpcIdAndUserId(
            npc.getId(), 
            currentUser.getId()
        ).orElse(null);

        return NpcDetailsResponse.from(savedNpc, npcNotes);
    }

    // =========================================================================
    // RELATIONSHIPS
    // =========================================================================

    public List<NpcQuestResponse> getQuestsByNpcId (Long npcId) {
        User currentUser = authService.getCurrentUser();

        Npc npc = npcRepository.findById(npcId)
            .orElseThrow(() -> new ResourceNotFoundException("NPC"));

        campaignAccessService.requireAccess(
            npc.getCampaign().getId(),
            currentUser.getId()
        );

        List<QuestNpc> questNpcs = questNpcRepository.findByNpcId(npcId);

        return questNpcs.stream()
            .map(NpcQuestResponse::from)
            .toList();
    }

    // =========================================================================
    // HELPER FUNCTIONS
    // =========================================================================\

    // private NpcResponse toResponse(Npc npc) {
    //     return NpcResponse.builder()
    //         .id(npc.getId())
    //         .name(npc.getName())
    //         .description(npc.getDescription())
    //         .level(npc.getLevel())
    //         .status(npc.getStatus())
    //         .role(npc.getRole())
    //         .race(npc.getRace())
    //         .occupation(npc.getOccupation())
    //         .personality(npc.getPersonality())
    //         .appearance(npc.getAppearance())
    //         .notes(npc.getNotes())
    //         .createdAt(npc.getCreatedAt())
    //         .build();
    // }
}
