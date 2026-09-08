package com.questbase.backend.notes.quest;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.questbase.backend.auth.User;
import com.questbase.backend.auth.service.AuthService;
import com.questbase.backend.campaign.CampaignAccessService;
import com.questbase.backend.exception.ResourceNotFoundException;
import com.questbase.backend.notes.quest.dto.CreateQuestNotesRequest;
import com.questbase.backend.notes.quest.dto.QuestNotesResponse;
import com.questbase.backend.quest.Quest;
import com.questbase.backend.quest.QuestRepository;

@Service
public class QuestNotesService {
    private final AuthService authService;
    private final CampaignAccessService campaignAccessService;
    private final QuestRepository questRepository;
    private final QuestNotesRepository questNotesRespository;

    public QuestNotesService(
        AuthService authService,
        CampaignAccessService campaignAccessService,
        QuestRepository questRepository,
        QuestNotesRepository questNotesRespository
    ) {
        this.authService = authService;
        this.campaignAccessService = campaignAccessService;
        this.questRepository = questRepository;
        this.questNotesRespository = questNotesRespository;
    }

    public QuestNotesResponse createQuestNotes(
        Long questId,
        CreateQuestNotesRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Quest quest = questRepository.findById(questId)
            .orElseThrow(() -> new ResourceNotFoundException("Quest"));

        campaignAccessService.requireAccess(
            quest.getCampaign().getId(),
            currentUser.getId()
        );

        QuestNotes notes = QuestNotes.builder()
            .quest(quest)
            .user(currentUser)
            .notes(request.notes())
            .build();

        QuestNotes savedNotes = questNotesRespository.save(notes);
        return QuestNotesResponse.from(savedNotes);
    }
    
    public QuestNotesResponse saveQuestNotes(
        Long questId,
        CreateQuestNotesRequest request
    ) {
        User currentUser = authService.getCurrentUser();

        Optional<QuestNotes> existingNotes = questNotesRespository.findByQuestIdAndUserId(
            questId, 
            currentUser.getId()
        );

        if (existingNotes.isPresent()) {
            QuestNotes questNotes = existingNotes.get();

            questNotes.setNotes(request.notes());
            questNotes.setUpdatedAt(LocalDateTime.now());

            QuestNotes savedNotes = questNotesRespository.save(questNotes);
            return QuestNotesResponse.from(savedNotes);
        }

        return createQuestNotes(questId, request);
    }
}
