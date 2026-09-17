export interface Location {
  id: number,
  parentId: number,
  name: string,
  description: string,
  type: string,
  status: string
  notes: string,
  createdAt: string,
  updatedAt: string
}

export interface LocationDetails {
  id: number,
  parentId: number,
  name: string,
  description: string,
  type: string,
  status: string
  notes: string,
  personalNotes: string
  createdAt: string,
  updatedAt: string,
  campaignId: number
}

export interface CreateLocationRequest {
  parentId: number | null,
  name: string,
  description: string,
  type: string,
  status: string,
  campaignId: number
}