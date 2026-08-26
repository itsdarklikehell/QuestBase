import { useEffect, useRef, useState } from "react"
import styles from "./QuestEditor.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import Dropdown from "@/components/Dropdown/Dropdown"
import { CreateQuestRequest, Quest } from "@/types/api/quest"
import { X } from "lucide-react"

interface QuestEditorProps {
  style?: React.CSSProperties
  action: string
  activeCampaignId: number | undefined
  quest?: Quest | null
  updateQuest: (id: number, quest: CreateQuestRequest) => void
  setEditorVisible: (visible: boolean) => void
}

const QuestEditor = ({ 
  style,
  action,
  activeCampaignId,
  quest,
  updateQuest,
  setEditorVisible
}: QuestEditorProps) => {

  const editorRef = useRef<HTMLDivElement | null>(null)
  const [id, setId] = useState<number>(-1)
  const [title, setTitle] = useState<string>("")
  const [status, setStatus] = useState<string>("NOT_STARTED")
  const [difficulty, setDifficulty] = useState<string>("")
  const [xp, setXp] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [buttonText, setButtontext] = useState<string>("Create")

  // TODO: fetch status and difficulty options from backend
  const statuses = [
    { label: "Not Started", value: "NOT_STARTED" },
    { label: "Active", value: "ACTIVE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Failed", value: "FAILED" }
  ]

  const difficulties = [
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD" },
    { label: "Deadly", value: "DEADLY" }
  ]

  useEffect(() => {
    if (quest) {
      setButtontext("Update")
      setId(quest.id)
      setTitle(quest.title)
      setXp(quest.rewardXp)
      setStatus(quest.status)
      setDifficulty(quest.difficulty)
      setDescription(quest.description)
    }
  },[quest])

  const resetQuestEditor = () => {
    setButtontext("Create")
    setId(-1)
    setTitle("")
    setXp("")
    setStatus("")
    setDifficulty("")
    setDescription("")
  }

  const handleCreateQuest = () => {
    const rewardXp = Number(xp);
    const quest: CreateQuestRequest = {
      title,
      description,
      status,
      difficulty,
      rewardXp,
      campaignId: Number(activeCampaignId)
    }
    updateQuest(id, quest)
    resetQuestEditor()
  }

  return (
    <div 
      ref={editorRef}
      className={`${layoutStyles.editor} ${styles.quest_editor}`}
      style={style}
    >
      <div className={styles.editor_content}>
        <div className={layoutStyles.editor_title}>
          <h2>
            {action === "Create" 
              ? <>Creating a <span>quest</span></>
              : <>Editing: <span>{title}</span></>
            }
          </h2>
          <X
            className={layoutStyles.green_close_icon} 
            onClick={() => setEditorVisible(false)}
          />
        </div>
        <div className={styles.editor_property}>
        <p>Title:</p>
          <input 
            type="text" 
            name="name" 
            placeholder="Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={layoutStyles.dark_input}
          />
        </div>
        <div className={styles.editor_container}>
          <div className={styles.editor_property}>
            <p>Status:</p>
            <Dropdown
              options={statuses}
              value={status}
              onChange={(status) => setStatus(status)}
              className={styles.quest_property}
            ></Dropdown>
          </div>
          <div className={styles.editor_property}>
            <p>Difficulty:</p>
            <Dropdown
              options={difficulties}
              value={difficulty}
              onChange={(diff) => setDifficulty(diff)}
              className={styles.quest_property}
            >
            </Dropdown>
          </div>
          <div className={styles.editor_property}>
            <p>Xp Reward:</p>
            <input 
              type="number" 
              name=""
              min={0}
              max={1000000}
              className={`${styles.quest_property} ${layoutStyles.dark_input}`}
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </div>
        </div>
        <p>Description:</p>
        <textarea 
          className={`${styles.quest_description} ${layoutStyles.dark_input}`}
          name="description" 
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <button 
            className={layoutStyles.green_button} 
            onClick={handleCreateQuest}
          >{buttonText}</button>
        </div>
      </div>
    </div>
  )
}

export default QuestEditor