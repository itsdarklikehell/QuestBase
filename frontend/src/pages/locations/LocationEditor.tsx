import Editor from "@/components/Editor/Editor"
import { CreateLocationRequest, Location } from "@/types/api/location"
import { useEffect, useState } from "react"
import editorStyles from "@/components/Editor/Editor.module.css"
import Dropdown from "@/components/Dropdown/Dropdown"
import { useCampaign } from "@/context/campaign/useCampaign"
import Loader from "@/components/ui/Loader/Loader"

interface LocationEditorProps {
  action: string
  location?: Location | null,
  loading: boolean,
  onTrigger: (npc: CreateLocationRequest) => void
  onClose: () => void
}

export default function LocationEditor({
  action, 
  location = null,
  loading,
  onTrigger,
  onClose
}: LocationEditorProps) {
  const { activeCampaign } = useCampaign()

  // const [ parentId, setParentId ] = useState<number | null>(null)
  const [ name, setName ] = useState<string>("")
  const [ description, setDescription ] = useState<string>("")
  const [ type, setType ] = useState<string>("")
  const [ status, setStatus ] = useState<string>("")

  const header = action === "Create"
    ? <>Creating a <span>Location</span></>
    : <>Editing: <span>{location?.name}</span></>

  const statuses = [
    { label: "Active", value: "ACTIVE" },
    { label: "Destroyed", value: "DESTROYED" },
    { label: "Abandoned", value: "ABANDONED" },
    { label: "Hidden", value: "HIDDEN" },
    { label: "Unknown", value: "UNKNOWN" }
  ]

  const types = [
    { label: "World", value: "WORLD" },
    { label: "Region", value: "REGION" },
    { label: "City", value: "CITY" },
    { label: "Town", value: "TOWN" },
    { label: "Village", value: "VILLAGE" },
    { label: "District", value: "DISTRICT" },
    { label: "Building", value: "BUILDING" },
    { label: "Landmark", value: "LANDMARK" },
    { label: "Dungeon", value: "DUNGEON" },
    { label: "Wilderness", value: "WILDERNESS" },
    { label: "Other", value: "OTHER" },
  ]

  useEffect(() => {
    if (location) {
      // setParentId(location.parentId)
      setName(location.name)
      setDescription(location.description)
      setType(location.type)
      setStatus(location.status)
    }
  },[location])

  const onClick = () => {
    if (!activeCampaign?.id) {
      console.error("No active campaign selected.")
      return
    }
    const createRequest: CreateLocationRequest = {
      parentId: null,
      name,
      description,
      type,
      status,
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
              <p>Status:</p>
              <Dropdown
                options={statuses}
                value={status}
                onChange={(s) => setStatus(s)}
                className={editorStyles.dropdown_property}
              ></Dropdown>
            </div>
            <div className={editorStyles.editor_property}>
              <p>Type:</p>
              <Dropdown
                options={types}
                value={type}
                onChange={(t) => setType(t)}
                className={editorStyles.dropdown_property}
              ></Dropdown>
            </div>
          </div>
          
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