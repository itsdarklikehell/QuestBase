import Dropdown from "@/components/Dropdown/Dropdown"
import Editor from "@/components/Editor/Editor"
import editorStyles from "@/components/Editor/Editor.module.css"
import Loader from "@/components/ui/Loader/Loader"
import { useCampaign } from "@/context/campaign/useCampaign"
import { CreateNpcRequest, Npc } from "@/types/api/npc"
import { useEffect, useState } from "react"

interface NpcEditorProps {
  action: string
  npc?: Npc | null,
  loading: boolean,
  onTrigger: (npc: CreateNpcRequest) => void
  onClose: () => void
}

export default function NpcEditor ({ 
  action, 
  npc = null,
  loading,
  onTrigger,
  onClose
}: NpcEditorProps) {
  const { activeCampaign } = useCampaign()

  const [ name, setName ] = useState<string>("")
  const [ level, setLevel ] = useState<string>("")
  const [ status, setStatus ] = useState<string>("")
  const [ role, setRole ] = useState<string>("")
  const [ race, setRace ] = useState<string>("")
  const [ occupation, setOccupation ] = useState<string>("")
  const [ description, setDescription ] = useState<string>("")
  const [ personality, setPersonality ] = useState<string>("")
  const [ appearance, setAppearance ] = useState<string>("")

  const header = action === "Create"
    ? <>Creating an <span>NPC</span></>
    : <>Editing: <span>{npc?.name}</span></>

  const statuses = [
    { label: "Alive", value: "ALIVE" },
    { label: "Dead", value: "DEAD" },
    { label: "Missing", value: "MISSING" },
    { label: "Unknown", value: "UNKNOWN" }
  ]

  const roles = [
    { label: "Ally", value: "ALLY" },
    { label: "Enemy", value: "ENEMY" },
    { label: "Neutral", value: "NEUTRAL" },
    { label: "Merchant", value: "MERCHANT" },
    { label: "Quest Giver", value: "QUEST_GIVER" },
    { label: "Other", value: "OTHER" }
  ]

  useEffect(() => {
    if (npc) {
      setName(npc.name)
      setLevel(String(npc?.level))
      setStatus(npc?.status)
      setRole(npc?.role)
      setRace(npc?.race)
      setOccupation(npc?.occupation)
      setDescription(npc?.description)
      setPersonality(npc?.personality)
      setAppearance(npc?.appearance)
    }
  },[npc])

  const onClick = () => {
    if (!activeCampaign?.id) {
      console.error("No active campaign selected.")
      return
    }
    const createRequest: CreateNpcRequest = {
      name,
      description,
      level: Number(level),
      status,
      role,
      race,
      occupation,
      personality,
      appearance,
      notes: "",
      campaignId: activeCampaign.id
    }
    onTrigger(createRequest)
  }

  return (
    <Editor
      header={header}
      onClose={onClose}
      children={
        <>
          <div className={editorStyles.editor_property}>
            <p>Name:</p>
            <input 
              type="text" 
              name="name" 
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={editorStyles.editor_container}>
            <div className={editorStyles.editor_property}>
              <p>Level:</p>
              <input 
                type="number"
                min={1} 
                name="level"
                placeholder="Level"
                value={level}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === "" || Number(value) >= 1) {
                    setLevel(value)
                  }
                }}
              />
            </div>
            <div className={editorStyles.editor_property}>
              <p>Status:</p>
              <Dropdown
                options={statuses}
                value={status}
                onChange={(s) => setStatus(s)}
                className={editorStyles.dropdown_property}
              ></Dropdown>
            </div>
            <div className={editorStyles.editor_property}>
              <p>Role:</p>
              <Dropdown
                options={roles}
                value={role}
                onChange={(r) => setRole(r)}
                className={editorStyles.dropdown_property}
              ></Dropdown>
            </div>
            <div className={editorStyles.editor_property}>
              <p>Race:</p>
              <input 
                type="text" 
                name="race" 
                placeholder="Race"
                value={race}
                onChange={(e) => setRace(e.target.value)}
              />
            </div>
          </div>
          <div className={editorStyles.editor_property}>
            <p>Occupation:</p>
            <input 
              type="text" 
              name="name" 
              placeholder="Occupation"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>
          <p>Appearance:</p>
          <textarea 
            name="appearance" 
            placeholder="Appearance"
            value={appearance}
            onChange={(e) => setAppearance(e.target.value)}
            className={editorStyles.small_textarea}
          />
          <p>Personality:</p>
          <textarea 
            name="personality" 
            placeholder="personality"
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className={editorStyles.small_textarea}
          />
          <p>Description:</p>
          <textarea 
            name="description" 
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {!loading ? (
            <button 
              className={editorStyles.button}
              onClick={onClick}
            >{action}</button>
          ) : (
            <Loader/>
          )}
        </>
      }
    />
  )
}