/**
 * Export/Import utilities for QuestBase
 * Supports exporting and importing campaign data as JSON
 */

export interface ExportData {
  version: string;
  exportedAt: string;
  campaigns: CampaignExport[];
}

export interface CampaignExport {
  id: number;
  name: string;
  description: string;
  quests: QuestExport[];
  npcs: NpcExport[];
  locations: LocationExport[];
  items: ItemExport[];
  characters: CharacterExport[];
  notes: NoteExport[];
}

export interface QuestExport {
  id: number;
  name: string;
  description: string;
  status: string;
  difficulty: string;
  rewards: string;
  npcIds: number[];
}

export interface NpcExport {
  id: number;
  name: string;
  role: string;
  description: string;
  level: number;
  notes: string;
}

export interface LocationExport {
  id: number;
  name: string;
  description: string;
  type: string;
}

export interface ItemExport {
  id: number;
  name: string;
  description: string;
  type: string;
  rarity: string;
}

export interface CharacterExport {
  id: number;
  name: string;
  race: string;
  class: string;
  level: number;
  background: string;
}

export interface NoteExport {
  id: number;
  title: string;
  content: string;
  isPublic: boolean;
  entityType: string;
  entityId: number;
}

/**
 * Export all campaign data to a JSON file
 */
export async function exportAllData(): Promise<void> {
  try {
    // Fetch all campaigns
    const campaignsResponse = await fetch('/api/campaigns');
    if (!campaignsResponse.ok) throw new Error('Failed to fetch campaigns');
    const campaigns = await campaignsResponse.json();

    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      campaigns: []
    };

    for (const campaign of campaigns) {
      const campaignExport: CampaignExport = {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        quests: [],
        npcs: [],
        locations: [],
        items: [],
        characters: [],
        notes: []
      };

      // Fetch quests for this campaign
      try {
        const questsResponse = await fetch(`/api/campaigns/${campaign.id}/quests`);
        if (questsResponse.ok) {
          const quests = await questsResponse.json();
          campaignExport.quests = quests.map((q: any) => ({
            id: q.id,
            name: q.name,
            description: q.description,
            status: q.status,
            difficulty: q.difficulty,
            rewards: q.rewards,
            npcIds: q.npcIds || []
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch quests for campaign ${campaign.id}:`, e);
      }

      // Fetch NPCs for this campaign
      try {
        const npcsResponse = await fetch(`/api/campaigns/${campaign.id}/npcs`);
        if (npcsResponse.ok) {
          const npcs = await npcsResponse.json();
          campaignExport.npcs = npcs.map((n: any) => ({
            id: n.id,
            name: n.name,
            role: n.role,
            description: n.description,
            level: n.level,
            notes: n.notes
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch NPCs for campaign ${campaign.id}:`, e);
      }

      // Fetch locations for this campaign
      try {
        const locationsResponse = await fetch(`/api/campaigns/${campaign.id}/locations`);
        if (locationsResponse.ok) {
          const locations = await locationsResponse.json();
          campaignExport.locations = locations.map((l: any) => ({
            id: l.id,
            name: l.name,
            description: l.description,
            type: l.type
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch locations for campaign ${campaign.id}:`, e);
      }

      // Fetch items for this campaign
      try {
        const itemsResponse = await fetch(`/api/campaigns/${campaign.id}/items`);
        if (itemsResponse.ok) {
          const items = await itemsResponse.json();
          campaignExport.items = items.map((i: any) => ({
            id: i.id,
            name: i.name,
            description: i.description,
            type: i.type,
            rarity: i.rarity
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch items for campaign ${campaign.id}:`, e);
      }

      // Fetch characters for this campaign
      try {
        const charactersResponse = await fetch(`/api/campaigns/${campaign.id}/characters`);
        if (charactersResponse.ok) {
          const characters = await charactersResponse.json();
          campaignExport.characters = characters.map((c: any) => ({
            id: c.id,
            name: c.name,
            race: c.race,
            class: c.class,
            level: c.level,
            background: c.background
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch characters for campaign ${campaign.id}:`, e);
      }

      // Fetch notes for this campaign
      try {
        const notesResponse = await fetch(`/api/campaigns/${campaign.id}/notes`);
        if (notesResponse.ok) {
          const notes = await notesResponse.json();
          campaignExport.notes = notes.map((n: any) => ({
            id: n.id,
            title: n.title,
            content: n.content,
            isPublic: n.isPublic,
            entityType: n.entityType,
            entityId: n.entityId
          }));
        }
      } catch (e) {
        console.warn(`Failed to fetch notes for campaign ${campaign.id}:`, e);
      }

      exportData.campaigns.push(campaignExport);
    }

    // Create and download the file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questbase-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}

/**
 * Import campaign data from a JSON file
 */
export async function importData(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData: ExportData = JSON.parse(content);

        // Validate the import data
        if (!importData.version || !importData.campaigns) {
          throw new Error('Invalid import file format');
        }

        // Import each campaign
        for (const campaign of importData.campaigns) {
          await importCampaign(campaign);
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Import a single campaign
 */
async function importCampaign(campaign: CampaignExport): Promise<void> {
  // Create the campaign
  const campaignResponse = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: campaign.name,
      description: campaign.description
    })
  });

  if (!campaignResponse.ok) {
    throw new Error(`Failed to create campaign: ${campaign.name}`);
  }

  const newCampaign = await campaignResponse.json();
  const newCampaignId = newCampaign.id;

  // Import quests
  for (const quest of campaign.quests) {
    await fetch(`/api/campaigns/${newCampaignId}/quests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: quest.name,
        description: quest.description,
        status: quest.status,
        difficulty: quest.difficulty,
        rewards: quest.rewards
      })
    });
  }

  // Import NPCs
  for (const npc of campaign.npcs) {
    await fetch(`/api/campaigns/${newCampaignId}/npcs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: npc.name,
        role: npc.role,
        description: npc.description,
        level: npc.level,
        notes: npc.notes
      })
    });
  }

  // Import locations
  for (const location of campaign.locations) {
    await fetch(`/api/campaigns/${newCampaignId}/locations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: location.name,
        description: location.description,
        type: location.type
      })
    });
  }

  // Import items
  for (const item of campaign.items) {
    await fetch(`/api/campaigns/${newCampaignId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: item.name,
        description: item.description,
        type: item.type,
        rarity: item.rarity
      })
    });
  }

  // Import characters
  for (const character of campaign.characters) {
    await fetch(`/api/campaigns/${newCampaignId}/characters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: character.name,
        race: character.race,
        class: character.class,
        level: character.level,
        background: character.background
      })
    });
  }

  // Import notes
  for (const note of campaign.notes) {
    await fetch(`/api/campaigns/${newCampaignId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: note.title,
        content: note.content,
        isPublic: note.isPublic,
        entityType: note.entityType,
        entityId: note.entityId
      })
    });
  }
}

/**
 * Export a single campaign
 */
export async function exportCampaign(campaignId: number): Promise<void> {
  try {
    const response = await fetch(`/api/campaigns/${campaignId}`);
    if (!response.ok) throw new Error('Failed to fetch campaign');
    const campaign = await response.json();

    const exportData: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      campaigns: [{
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        quests: campaign.quests || [],
        npcs: campaign.npcs || [],
        locations: campaign.locations || [],
        items: campaign.items || [],
        characters: campaign.characters || [],
        notes: campaign.notes || []
      }]
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questbase-campaign-${campaign.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
}
