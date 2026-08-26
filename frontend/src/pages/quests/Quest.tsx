import styles from "./Quests.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useNavigate } from "react-router-dom"
import { Quest as QuestType } from "@/types/api/quest"
import { useState } from "react"
import { Edit, Trash2 } from "lucide-react"

interface QuestProp {
  quest: QuestType
  index: number
  editable: boolean
  fetchQuests?: () => void
  editing?: { quest: QuestType | null, index: number},
  setEditing?: (editing: { 
    quest: QuestType | null, 
    index: number
  }) => void
}

export default function Quest ({ 
  quest, 
  index,
  editable,
  fetchQuests,
  editing,
  setEditing
}: QuestProp) {
  const navigate = useNavigate()
  const [confirmDeletion, setConfirmDeletion] = useState<number>(-1)

  const deleteQuest = async (id: number) => {
    try {
      const response = await fetch(`/api/quests/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchQuests?.()
        setConfirmDeletion(-1)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to update quest: ", error)
    }
  }

  return (
    <div 
      className={layoutStyles.card}
      style={{ order: index, display: editing?.index === index ? "none" : "flex" }}
      onClick={() => navigate(`/quests/${quest.id}`)}
    >
      <div className={styles.quest_card_header}>
        <p className={layoutStyles.card_title}>{quest.title}</p>
        <div className={styles.quest_card_properties}>
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
      </div>
      <p>{quest.description}</p>
      {editable && <div className={styles.quest_actions}>
        {confirmDeletion === quest.id
          ? <div className={styles.confirm_deletion}>
              <p>Are you sure you want to <span>DELETE</span> this quest?</p>
              <button onClick={(e) => {
                e.stopPropagation()
                deleteQuest(quest.id)
              }}>Yes</button>
              <button onClick={(e) => {
                e.stopPropagation()
                setConfirmDeletion(-1)
              }}>No</button>
            </div>
          : <>
              <Edit
                className={layoutStyles.edit_icon}
                onClick={(e) => {
                  e.stopPropagation()
                  setEditing?.({ quest, index })
                }} 
              />
              <Trash2 
                className={layoutStyles.trash_icon}
                onClick={(e) => {
                  e.stopPropagation()
                  setConfirmDeletion(quest.id)
                }}
              />
            </>}
      </div>}
    </div>
  )
}