import DOMPurify from "dompurify";
import { CreateQuestRequest, Quest } from "@/types/api/quest"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Quests.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import DetailPage from "@/components/ui/DetailPage/DetailPage"
import DetailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import TextEditor from "@/components/ui/TextEditor/TextEditor"
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

export default function QuestDetails () {
  const { questId } = useParams()
  const navigate = useNavigate()
  const { activeCampaign } = useCampaign()
  // TODO: fix to actual quest's campaign
  const [ owner ] = useState<boolean>(activeCampaign?.role === CampaignMemberRole.OWNER)
  const [ quest, setQuest ] = useState<Quest | null>(null)
  const [ notes, setNotes ] = useState<string>("")
  const [ questNpcs, setQuestNpcs ] = useState<QuestNpcType[]>([])
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ editting, setEditting ] = useState<boolean>(false)
  const [ showNpcQuestEditor, setShowNpcQuestEditor ] = useState<boolean>(false)

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
        const quest = await response.json()
        setQuest(quest)
        setNotes(quest?.notes)
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
                  {(notes || owner) && 
                    <div>
                      <p className={DetailPageStyles.text_label}>General Notes:</p>
                      {owner ? (
                        <TextEditor
                          value={notes}
                          onChange={setNotes}
                        />
                      ) : (
                        <div 
                          className={layoutStyles.editor_notes}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(notes)
                          }}
                        />
                      )}
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