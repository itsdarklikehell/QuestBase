import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import styles from "./Quests.module.css"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { CreateQuestRequest, Quest as QuestType } from "@/types/api/quest"
import { useCampaign } from "@/context/campaign/useCampaign"
import QuestEditor from "./QuestEditor/QuestEditor"
import CampaignEmptyState from "@/components/states/CampaignEmptyState/CampaignEmptyState"
import PageHeader from "@/components/ui/PageHeader/PageHeader"
import CreateButton from "@/components/ui/CreateButton/CreateButton"
import Quest from "./Quest"
import { fetchQuests } from "@/api/quests"
import { CampaignMemberRole } from "@/types/api/campaignMember"

const Quests = () => {
  const { user } = useAuth()
  const { activeCampaign } = useCampaign()
  // TODO: fix to actual quest's campaign
  const [ owner ] = useState<boolean>(activeCampaign?.role === CampaignMemberRole.OWNER)
  const [quests, setQuests] = useState<QuestType[]>([])
  const noResultsRef = useRef<HTMLDivElement | null>(null)
  const createDivRef = useRef<HTMLDivElement | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const [editing, setEditing] = useState<{ 
    quest: QuestType | null, 
    index: number
  }>({ quest: null, index: -1 })

  const handleFetchQuests = useCallback(async () => {
    if (!activeCampaign?.id) return;
    try {
      const quests = await fetchQuests(activeCampaign?.id)
      if (quests) setQuests(quests)
    } catch (error) {
      console.error("Failed to fetch quests: ", error);
    }
  }, [activeCampaign?.id]);

  useEffect(() => {
    if (user && activeCampaign?.id) {
      handleFetchQuests()
    }
  }, [user, activeCampaign, handleFetchQuests])

  const createQuest = async (questRequest: CreateQuestRequest) => {
    try {
      validate(questRequest)
      const response = await fetch('/api/quests', { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questRequest)
      })
      if (response.ok) {
        const newQuest = await response.json()
        setQuests([...quests, newQuest])
        setEditorVisible('create', false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create quest: ", error)
    }
  }

  const editQuest = async (id: number, questRequest: CreateQuestRequest) => {
    if (id < 0) {
      console.error("No quest id provided.")
      return
    }
    try {
      validate(questRequest)
      const response = await fetch(`/api/quests/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questRequest)
      })
      if (response.ok) {
        handleFetchQuests()
        setEditorVisible('edit', false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to update quest: ", error)
    }
  }

  const validate = (quest: CreateQuestRequest) => {
    if (!quest.title) 
      throw new Error("Please enter a valid quest title.")
    else if (quest.rewardXp < 0 || quest.rewardXp > 1000000) 
      throw new Error("XP reward must be between 0 and 1,000,000")
    else if (!quest.campaignId) 
      throw new Error("No active campaign was found.")
  }

  const setEditorVisible = (type: string, visible: boolean) => {
    if (type === 'create') {
      setCreating(visible ? true : false)
    }

    if (noResultsRef.current && quests.length <= 0) 
      noResultsRef.current.style.display = visible ? "none" : "flex"
    if (createDivRef.current)
      createDivRef.current.style.display = visible ? "none" : "flex"

    if (!visible && type === 'edit') setEditing({ quest: null, index: -1})
  }

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader title="Quests" activeCampaign={activeCampaign}/>
      {creating && <QuestEditor
        action="Create"
        activeCampaignId={activeCampaign?.id}
        updateQuest={(_id, req) => createQuest(req)}
        setEditorVisible={(visible) => setEditorVisible('create', visible)}
      />}
      {/* QUESTS */}
      {!activeCampaign ? (
          <CampaignEmptyState type={"quests"} />
        ) : quests.length > 0 ? (
          <>
            {!creating && <CreateButton
              text="Create a new Quest"
              onClick={() => setEditorVisible('create', true)}
            />}
            <div className={styles.quests}>
                {quests.map((quest, i) => (
                  <Quest
                    key={i}
                    quest={quest}
                    index={i}
                    editable={owner}
                    fetchQuests={handleFetchQuests}
                    editing={editing}
                    setEditing={setEditing}
                  />
                ))}
                {editing.index >= 0 && <QuestEditor
                  action="Edit"
                  activeCampaignId={activeCampaign?.id ?? 0}
                  quest={editing.quest}
                  updateQuest={(id, req) => editQuest(id, req)}
                  setEditorVisible={(visible) => setEditorVisible('edit', visible)}
                />}
            </div>
          </>
          ) : (
            <div 
              ref={noResultsRef}
              className={layoutStyles.no_results}
            >
              <div>
                <h2>No quests Found</h2>
                <p>Create a new quest for your campaign below!</p>
              </div>
              <CreateButton
                text="Create a new quest"
                onClick={() => setEditorVisible('create', true)}
              />
            </div>
          )
        }
    </div>
  )
}

export default Quests