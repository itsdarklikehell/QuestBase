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

export interface CreateLocationRequest {
  parentId: number | null,
  name: string,
  description: string,
  type: string,
  status: string,
  campaignId: number
}