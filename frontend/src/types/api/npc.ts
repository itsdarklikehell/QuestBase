export interface Npc {
  id: number,
  name: string,
  description: string,
  level: number,
  status: string,
  role: string,
  race: string,
  occupation: string,
  personality: string,
  appearance: string,
  notes: string,
  createdAt: string
  campaignId: number
}

export interface NpcDetails {
  id: number,
  name: string,
  description: string,
  level: number,
  status: string,
  role: string,
  race: string,
  occupation: string,
  personality: string,
  appearance: string,
  notes: string,
  createdAt: string
  campaignId: number,
  personalNotes: NpcNotes
}

export interface CreateNpcRequest {
  name: string,
  description: string,
  level: number | undefined,
  status: string,
  role: string,
  race: string,
  occupation: string,
  personality: string,
  appearance: string,
  notes: string,
  campaignId: number
}

export interface NpcNotes {
  id: number,
  npc_id: number,
  user_id: number,
  notes: string,
  createdAt: string,
  updatedAt: string
}