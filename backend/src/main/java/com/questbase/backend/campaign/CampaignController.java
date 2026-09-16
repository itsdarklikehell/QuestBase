package com.questbase.backend.campaign;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.questbase.backend.campaign.dto.CampaignResponse;
import com.questbase.backend.campaign.dto.CreateCampaignRequest;
import com.questbase.backend.location.LocationService;
import com.questbase.backend.location.dto.LocationResponse;
import com.questbase.backend.npc.NpcService;
import com.questbase.backend.npc.dto.NpcResponse;
import com.questbase.backend.quest.QuestService;
import com.questbase.backend.quest.dto.QuestResponse;
import com.questbase.backend.relationship.campaignInvite.CampaignInviteService;
import com.questbase.backend.relationship.campaignInvite.dto.CampaignInviteResponse;
import com.questbase.backend.relationship.campaignInvite.dto.CreateCampaignInviteRequest;
import com.questbase.backend.relationship.campaignMember.CampaignMemberService;
import com.questbase.backend.relationship.campaignMember.dto.CampaignMemberResponse;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {
    private final CampaignService campaignService;
    private final CampaignInviteService campaignInviteService;
    private final CampaignMemberService campaignMemberService;
    private final LocationService locationService;
    private final NpcService npcService;
    private final QuestService questService;

    public CampaignController(
        CampaignService campaignService,
        CampaignInviteService campaignInviteService,
        CampaignMemberService campaignMemberService,
        LocationService locationService,
        NpcService npcService,
        QuestService questService
    ) {
        this.campaignService = campaignService;
        this.campaignInviteService = campaignInviteService;
        this.campaignMemberService = campaignMemberService;
        this.locationService = locationService;
        this.npcService = npcService;
        this.questService = questService;
    }

    @GetMapping("/{id}")
    public CampaignResponse getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id);
    }

    @GetMapping()
    public List<CampaignResponse> getAllCampaigns() {
        return campaignService.getAllCampaigns();
    }

    @PostMapping()
    public CampaignResponse createCampaign(
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        return campaignService.createCampaign(request);
    }

    @PutMapping("/{id}")
    public CampaignResponse updateCampaign(
        @PathVariable Long id, 
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        return campaignService.updateCampaign(id, request);
    }

    @PatchMapping("/{id}")
    public CampaignResponse patchCampaign(
        @PathVariable Long id,
        @Valid @RequestBody CreateCampaignRequest request
    ) {
        return campaignService.patchCampaign(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteCampaign(@PathVariable Long id) {
        campaignService.deleteCampaign(id);
    }

    // =========================================================================
    // Relationships
    // =========================================================================

    @GetMapping("/{campaignId}/locations")
    public ResponseEntity<List<LocationResponse>> getCampaignLocations(
        @PathVariable Long campaignId
    ) {
        List<LocationResponse> locations =
            locationService.getLocationsByCampaignId(
                campaignId
            );

        return ResponseEntity.ok(locations);
    }

    @GetMapping("/{campaignId}/npcs")
    public ResponseEntity<List<NpcResponse>> getCampaignNpcs(
        @PathVariable Long campaignId,
        @RequestParam(defaultValue = "desc") String sort
    ) {
        List<NpcResponse> npcs =
            npcService.getNpcsByCampaignId(
                campaignId,
                sort
            );

        return ResponseEntity.ok(npcs);
    }

    @GetMapping("/{campaignId}/quests")
    public ResponseEntity<List<QuestResponse>> getCampaignQuests(
        @PathVariable Long campaignId,
        @RequestParam(defaultValue = "desc") String sort
    ) {

        List<QuestResponse> quests =
            questService.getQuestsByCampaignId(
                campaignId,
                sort
            );

        return ResponseEntity.ok(quests);
    }

    @GetMapping("/{campaignId}/players")
    public List<CampaignMemberResponse> getPlayers(
        @PathVariable Long campaignId
    ) {
        return campaignMemberService.getPlayers(campaignId);
    }

    @GetMapping("/{campaignId}/invites")
    public List<CampaignInviteResponse> getPlayerInvites(
        @PathVariable Long campaignId
    ) {
        return campaignInviteService.getInvites(
            campaignId
        );
    }

    @PostMapping("/{campaignId}/invites")
    public CampaignInviteResponse invitePlayer(
        @PathVariable Long campaignId,
        @RequestBody CreateCampaignInviteRequest request
    ) {
        return campaignInviteService.createInvite(
            campaignId,
            request
        );
    }
    
}
