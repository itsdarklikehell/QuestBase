import { CreateNpcRequest, Npc } from "@/types/api/npc"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Npcs.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { BookPlus, Briefcase, ChartNoAxesColumnIncreasing, IdCard } from "lucide-react"
import NpcEditor from "./NpcEditor"
import DetailPage from "@/components/ui/DetailPage/DetailPage"
import DetailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import Loader from "@/components/ui/Loader/Loader"
import DetailNotFound from "@/components/states/DetailNotFound/DetailNotFound"
import { DetailDropdownOption } from "@/components/ui/DetailPage/DetailDropdown"
import QuestNpcEditor, { QuestNpcEditorAction } from "./QuestNpcEditor"
import { fetchQuestsForNpc } from "@/api/npcs"
import { type NpcQuest as NpcQuestType } from "@/types/api/questnpc"
import NpcQuest from "./NpcQuest"
import { useCampaign } from "@/context/campaign/useCampaign"
import { CampaignMemberRole } from "@/types/api/campaignMember"
import DetailPageEditors from "@/components/ui/DetailPageEditors/DetailPageEditors"

export default function NpcsDetails () {
  const { campaigns } = useCampaign()
  const { npcId } = useParams()
  const navigate = useNavigate()
  const [ owner, setOwner ] = useState<boolean>(false)

  const [ npc, setNpc ] = useState<Npc | null>(null)
  const [ notes, setNotes ] = useState<string>("")
  const [ personalNotes, setPersonalNotes ] = useState<string>("")
  const [ npcQuests, setNpcQuests ] = useState<NpcQuestType[]>([])
  
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ submitting, setSubmitting ] = useState<boolean>(false)
  const [ editting, setEditting ] = useState<boolean>(false)

  const [ showNpcQuestEditor, setShowNpcQuestEditor ] = useState<boolean>(false)
  const [ showGeneralEditor, setShowGeneralEditor ] = useState<boolean>(false)
  const [ showPersonalEditor, setShowPersonalEditor ] = useState<boolean>(false)

  useEffect(() => {
    if (campaigns.length > 0 && npc?.campaignId) {
      const campaign = campaigns.find((campaign) => campaign.id === npc.campaignId)
      if (campaign) setOwner(campaign.role === CampaignMemberRole.OWNER)
    }
  },[campaigns, npc?.campaignId])

  const toggleEdit = () => {
    setEditting(!editting)
  }

  const fetchQuests = useCallback(async () => {
    if (!npcId) return
    try {
      const quests = await fetchQuestsForNpc(Number(npcId))
      if (quests) setNpcQuests(quests)
    } catch (error) {
      console.error("Failed to fetch NPC's quests: ", error)
    }
  },[npcId])

  const fetchNpc = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/npcs/${npcId}`,
        { method: "GET" }
      )
      if (response.ok) {
        const npc = await response.json()
        setNpc(npc)
        setNotes(npc?.notes)
        if (npc?.personalNotes) setPersonalNotes(npc.personalNotes.notes)
        fetchQuests()
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to fetch NPC: ", error)
    } finally {
      setLoading(false)
    }
  },[npcId, fetchQuests])

  useEffect(() => {
    fetchNpc()
  },[fetchNpc])

  const updateNpc = async (npcRequest: CreateNpcRequest) => {
    try {
      setSubmitting(true)
      const response = await fetch(`/api/npcs/${npcId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(npcRequest)
      })
      if (response.ok) {
        const savedNpc = await response.json()
        setNpc(savedNpc)
        toggleEdit()
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create NPC: ", error)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteNpc = async () => {
    try {
      const response = await fetch(
        `/api/npcs/${npcId}`, 
        { method: "DELETE" }
      )
      if (response.ok) {
        navigate("/npcs")
      } else console.error(response)
    } catch (error) {
      console.error("Failed to delete NPC: ", error)
    }
  }

  const saveNotes = useCallback(async (notes: string) => {
    try {
      const response = await fetch(`/api/npcs/${npcId}/save-notes`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      })
      if (response.ok) {
        const npc = await response.json()
        setNpc(npc)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to save NPC notes: ", error)
    }
  }, [npcId])

  useEffect(() => {
    if (owner) {
      const timeout = setTimeout(() => {
        if (!notes) return
        saveNotes(notes)
      }, 1500)

      return () => clearTimeout(timeout)
    }
  }, [notes, saveNotes, owner])

  const savePersonalNotes = useCallback(async (notes: string) => {
    try {
      const response = await fetch(`/api/npcs/${npcId}/save-personal-notes`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      })
      if (response.ok) {
        const notes = await response.json()
        setPersonalNotes(notes.notes)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to save personal NPC notes: ", error)
    }
  }, [npcId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!personalNotes) return
      savePersonalNotes(personalNotes)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [personalNotes, savePersonalNotes, owner])

  // ===========================================================================
  // Add Dropdown Functionality 
  // ===========================================================================

  const onAdd = (option: string) => {
    switch (option) {
      case "Add to Quest": setShowNpcQuestEditor(true)
    }
  }

  const dropdownOptions: DetailDropdownOption[] = [
    { icon: <BookPlus/>, text: "Add to Quest" }
  ]

  return (
    <div className={layoutStyles.page_container}>
      {npc ? (
          <DetailPage
            title={npc.name}
            dropdownOptions={dropdownOptions}
            editable={owner}
            editting={editting}
            onAdd={onAdd}
            onEdit={(active) => setEditting(active)}
            onDelete={deleteNpc}
            children={
              <div className={DetailPageStyles.information}>
                {showNpcQuestEditor && npcId &&
                    <QuestNpcEditor 
                      parent={{ id: npcId, type: "npc" }}
                      action={QuestNpcEditorAction.CREATE}
                      onAction={fetchQuests}
                      onClose={() => setShowNpcQuestEditor(false)}
                    />
                  }
                {editting ? (
                  <>
                    <NpcEditor 
                      action="Update"
                      npc={npc}
                      loading={submitting}
                      onTrigger={(npc) => updateNpc(npc)}
                      onClose={toggleEdit}
                    />
                  </>
                ) : (
                  <>
                    <div className={DetailPageStyles.traits}>
                      {npc.status && <p className={`${styles.npc_property} ${styles.npc_status} ${styles[npc.status]}`}>{npc.status}</p>}
                      {npc.role && <p className={`${styles.npc_property} ${styles.npc_role} ${styles[npc.role]}`}>{npc.role.replace(/_/g, " ")}</p>}
                      {npc.level > 0 && <div>
                        <ChartNoAxesColumnIncreasing/>
                        <p>Level {npc.level}</p>
                      </div>}
                      {npc.race && <div>
                        <IdCard />
                        <p>{npc.race}</p>
                      </div>}
                      {npc.occupation && <div>
                        <Briefcase />
                        <p>{npc.occupation}</p>
                      </div>}
                      {/* add class later */}
                    </div>
                    {npc.description && 
                      <div className={DetailPageStyles.text}>
                        <p className={DetailPageStyles.text_label}>Description:</p>
                        <p>{npc.description}</p>
                      </div>
                    }
                    <div className={DetailPageStyles.info_2}>
                      {npc.personality && <div className={DetailPageStyles.text}>
                        <p className={DetailPageStyles.text_label}>Personality:</p>
                        <p>{npc.personality}</p>
                      </div>}
                      {npc.appearance && <div className={DetailPageStyles.text}>
                        <p className={DetailPageStyles.text_label}>Appearance:</p>
                        <p>{npc.appearance}</p>
                      </div>}
                    </div>
                  </>
                )}

                <hr className={DetailPageStyles.section_hr}/>

                <DetailPageEditors
                  owner={owner}
                  general={{
                    notes,
                    setNotes,
                    show: showGeneralEditor,
                    setShow: setShowGeneralEditor,
                  }}
                  personal={{
                    notes: personalNotes,
                    setNotes: setPersonalNotes,
                    show: showPersonalEditor,
                    setShow: setShowPersonalEditor,
                  }}
                />

                <hr className={DetailPageStyles.section_hr}/>
                                
                {npcQuests.length > 0 && 
                  <div>
                    <p className={DetailPageStyles.text_label}>Quests:</p>
                      <div className={DetailPageStyles.information_2}>
                        {npcQuests.map((npcQuest) => (
                          <NpcQuest
                            key={npcQuest.id}
                            npcQuest={npcQuest}
                            fetchQuests={fetchQuests}
                            editable={owner}
                          />
                        ))}
                      </div>
                  </div>
                }
              </div>
            }
          />
      ) : loading ? (
        <Loader />
      ) : (
        <DetailNotFound 
          title={<><span>NPC</span> Not Found</>}
          message="This NPC seems to have vanished from the realm."
          buttonText="Back to NPCs"
          onClick={() => navigate("/npcs")}
        />
      )}
    </div>
  )
}