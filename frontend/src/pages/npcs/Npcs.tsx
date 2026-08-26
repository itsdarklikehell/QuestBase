import { useCampaign } from "@/context/campaign/useCampaign"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import PageHeader from "@/components/ui/PageHeader/PageHeader"
import CampaignEmptyState from "@/components/states/CampaignEmptyState/CampaignEmptyState"
import CreateButton from "@/components/ui/CreateButton/CreateButton"
import { useCallback, useEffect, useState } from "react"
import NpcEditor from "./NpcEditor"
import { CreateNpcRequest, NpcDetails } from "@/types/api/npc"
import { useAuth } from "@/context/AuthContext"
import Npc from "./Npc"

export default function Npcs () {
  const { user } = useAuth()
  const { activeCampaign } = useCampaign()
  const [ npcs, setNpcs ] = useState<NpcDetails[]>([])
  const [ openCreateEditor, setOpenCreateEditor ] = useState<boolean>()
  const [ submitting, setSubmitting ] = useState<boolean>(false)

  const toggleEditor = () => {
    setOpenCreateEditor(!openCreateEditor)
  }

  const fetchNpcs = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const response = await fetch(
        `/api/campaigns/${activeCampaign.id}/npcs`,
        { method: "GET" }
      )
      if (response.ok) {
        const npcs = await response.json();
        setNpcs(npcs);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Failed to fetch npcs: ", error);
    }
  }, [activeCampaign?.id])
  
  useEffect(() => {
    if (user && activeCampaign?.id) {
      fetchNpcs()
    }
  }, [user, activeCampaign, fetchNpcs])

  const createNpc = async (npcRequest: CreateNpcRequest) => {
    try {
      setSubmitting(true)
      const data = validateNPCRequest(npcRequest)
      const response = await fetch('/api/npcs', { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        const newNpc = await response.json()
        setNpcs([...npcs, newNpc])
        toggleEditor()
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create NPC: ", error)
    } finally {
      setSubmitting(false)
    }
  }

  const validateNPCRequest = (npc: CreateNpcRequest) => {
    const cleanedNpc = Object.fromEntries(
      Object.entries(npc).map(([key, value]) => [
        key,
        typeof value === "string" && value.trim() === ""
          ? null
          : value
      ])
    );
    if (!cleanedNpc.name) {
      throw new Error("A name is required.")
    }
    return cleanedNpc
  }

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader 
        title="NPCs"
        activeCampaign={activeCampaign}/>
      {openCreateEditor && 
        <NpcEditor
          action="Create"
          loading={submitting}
          onTrigger={(npc: CreateNpcRequest) => createNpc(npc)}
          onClose={toggleEditor}
        />}
      {!activeCampaign ? (
        <CampaignEmptyState type={"NPCs"} />
      ) : npcs.length > 0 ? (
        <>
          {!openCreateEditor && <CreateButton
            text="Create an NPC"
            onClick={toggleEditor}
          />}
          {npcs.map((npc) => (
            <Npc
              key={npc.id} 
              npc={npc}
            />
          ))}
        </>
      ) : (
        <>
          {!openCreateEditor && 
            <div className={layoutStyles.no_results}>
              <div>
                <h2>No NPCs Found</h2>
                <p>Create a new NPC for your campaign below!</p>
              </div>
              <CreateButton
                text="Create an NPC"
                onClick={() => toggleEditor()}
              />
            </div>
          }
        </>
      )}
    </div>
  )
}