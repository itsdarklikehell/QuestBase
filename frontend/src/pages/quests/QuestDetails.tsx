import { CreateQuestRequest, Quest, QuestDetails as QuestDetailsType } from "@/types/api/quest"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Quests.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import DetailPage from "@/components/ui/DetailPage/DetailPage"
import DetailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import QuestEditor from "./QuestEditor/QuestEditor"
import { useCampaign } from "@/context/campaign/useCampaign"
import Loader from "@/components/ui/Loader/Loader"
import DetailNotFound from "@/components/states/DetailNotFound/DetailNotFound"
import { fetchNpcsForQuest } from "@/api/quests"
import { type QuestNpc as QuestNpcType } from "@/types/api/questnpc"
import QuestNpc from "./QuestNpc"
import { DetailDropdownOption } from "@/components/ui/DetailPage/DetailDropdown"
import { UserPlus } from "lucide-react"
import QuestNpcEditor, { QuestNpcEditorAction } from "../npcs/QuestNpcEditor"
import { CampaignMemberRole } from "@/types/api/campaignMember"
import DetailPageEditors from "@/components/ui/DetailPageEditors/DetailPageEditors";

export default function QuestDetails () {
  const { questId } = useParams()
  const navigate = useNavigate()
  const { activeCampaign, campaigns } = useCampaign()
  const [ owner, setOwner ] = useState<boolean>(false)

  const [ quest, setQuest ] = useState<Quest | null>(null)
  const [ notes, setNotes ] = useState<string>("")
  const [ personalNotes, setPersonalNotes ] = useState<string>("")
  const [ questNpcs, setQuestNpcs ] = useState<QuestNpcType[]>([])

  const [ loading, setLoading ] = useState<boolean>(true)
  const [ editting, setEditting ] = useState<boolean>(false)
  const [ showNpcQuestEditor, setShowNpcQuestEditor ] = useState<boolean>(false)
  const [ showGeneralEditor, setShowGeneralEditor ] = useState<boolean>(false)
  const [ showPersonalEditor, setShowPersonalEditor ] = useState<boolean>(false)

  useEffect(() => {
    if (campaigns.length > 0 && quest?.campaignId) {
      const campaign = campaigns.find((campaign) => campaign.id === quest.campaignId)
      if (campaign) setOwner(campaign.role === CampaignMemberRole.OWNER)
    }
  },[campaigns, quest?.campaignId])

  const fetchNpcs = useCallback(async () => {
    try {
      const npcs = await fetchNpcsForQuest(Number(questId))
      if (npcs) setQuestNpcs(npcs)
    } catch (error) {
      console.error("Failed to fetch quests: ", error)
    }
  }, [questId])

  const fetchQuest = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/quests/${questId}`,
        { method: "GET" }
      )
      if (response.ok) {
        const quest: QuestDetailsType = await response.json()
        setQuest(quest)
        setNotes(quest?.notes)
        if (quest?.personalNotes) 
          setPersonalNotes(quest.personalNotes.notes)
        fetchNpcs()
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to fetch NPC: ", error)
    } finally {
      setLoading(false)
    }
  }, [questId, fetchNpcs])

  useEffect(() => {
    fetchQuest()
  },[fetchQuest])

  const saveNotes = useCallback(async (notes: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/save-notes`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      })
      if (response.ok) {
        const quest = await response.json()
        setQuest(quest)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to save NPC notes: ", error)
    }
  }, [questId])

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
      const response = await fetch(`/api/quests/${questId}/save-personal-notes`, { 
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
      console.error("Failed to save personal quest notes: ", error)
    }
  }, [questId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!personalNotes) return
      savePersonalNotes(personalNotes)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [personalNotes, savePersonalNotes, owner])

  const updateQuest = async (
    id: number, 
    questRequest: CreateQuestRequest
  ) => {
    try {
      const response = await fetch(`/api/quests/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questRequest)
      })
      if (response.ok) {
        const savedQuest = await response.json()
        setQuest(savedQuest)
        setEditting(false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to update quest: ", error)
    }
  }

  const deleteQuest = async () => {
    try {
      const response = await fetch(`/api/quests/${questId}`, { method: "DELETE" })
      if (response.ok) {
        navigate("/quests")
      } else console.error(response)
    } catch (error) {
      console.error("Failed to delete quest: ", error)
    }
  }

  const onAdd = (option: string) => {
    switch (option) {
      case "Add an NPC": setShowNpcQuestEditor(true)
    }
  }

  const dropdownOptions: DetailDropdownOption[] = [
    { icon: <UserPlus/>, text: "Add an NPC" }
  ]

  return (
    <div className={layoutStyles.page_container}>
      {quest ? (
        <DetailPage
          title={quest.title}
          editable={owner}
          editting={editting}
          dropdownOptions={dropdownOptions}
          onAdd={onAdd}
          onEdit={(active) => setEditting(active)}
          onDelete={deleteQuest}
          children={
            <div className={DetailPageStyles.information}>
              {editting ? (
                <QuestEditor
                  action="Edit"
                  activeCampaignId={activeCampaign?.id}
                  quest={quest}
                  updateQuest={updateQuest}
                  setEditorVisible={(visible) => setEditting(visible)}
                />
              ) : (
                <>
                  {showNpcQuestEditor && questId &&
                    <QuestNpcEditor 
                      parent={{ id: questId, type: "quest" }}
                      action={QuestNpcEditorAction.CREATE}
                      onAction={fetchNpcs}
                      onClose={() => setShowNpcQuestEditor(false)}
                    />
                  }
                  <div className={DetailPageStyles.traits}>
                    <p className={`${styles.quest_card_property} ${styles.quest_status} ${styles[quest.status]}`}>
                      {quest.status.replace(/_/g, " ")}
                    </p>
                    <p className={`${styles.quest_card_property} ${styles.quest_difficulty} ${styles[quest.difficulty]}`}>
                      {quest.difficulty}
                    </p>
                    <p className={`${styles.quest_card_property} ${styles.quest_xp}`}>
                      {quest.rewardXp}{" "}XP
                    </p>
                  </div>
                  {quest.description && 
                    <div className={DetailPageStyles.text}>
                      <p className={DetailPageStyles.text_label}>Description:</p>
                      <p>{quest.description}</p>
                    </div>
                  }

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

                  {questNpcs.length > 0 && 
                    <div>
                      <p className={DetailPageStyles.text_label}>NPCs:</p>
                        <div className={DetailPageStyles.information_2}>
                          {questNpcs.map((questNpc) => (
                            <QuestNpc
                              key={questNpc.id}
                              questNpc={questNpc}
                              fetchNpcs={fetchNpcs}
                              editable={owner}
                            />
                          ))}
                        </div>
                    </div>
                  }

                </>
              )}
            </div>
          }
        />
      ) : loading ? (
        <Loader />
      ) : (
        <DetailNotFound 
          title={<><span>Quest</span> Not Found</>}
          message="This quest seems to have vanished from the realm."
          buttonText="Back to quests"
          onClick={() => navigate("/quests")}
        />
      )}
    </div>
  )
}