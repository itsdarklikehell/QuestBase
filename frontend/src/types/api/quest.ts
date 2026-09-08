export interface Quest {
  id: number,
  title: string,
  description: string,
  status: string,
  difficulty: string,
  rewardXp: string,
  createdAt: string,
  campaignId: number
}

export interface QuestDetails {
  id: number,
  title: string,
  description: string,
  status: string,
  difficulty: string,
  rewardXp: string,
  createdAt: string,
  campaignId: number,
  notes: string,
  personalNotes: QuestNotes
}

export interface CreateQuestRequest {
  title: string,
  description: string,
  status: string,
  difficulty: string,
  rewardXp: number,
  campaignId: number
}

export interface QuestNotes {
  id: number,
  quest_id: number,
  user_id: number,
  notes: string,
  createdAt: string,
  updatedAt: string
}