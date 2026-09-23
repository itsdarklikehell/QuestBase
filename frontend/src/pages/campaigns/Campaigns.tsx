import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import styles from "./Campaigns.module.css"
import { Campaign } from "@/types/api/campaign";
import { useRef, useState } from "react"
import { useCampaign } from "@/context/campaign/useCampaign";
import CampaignBanner from "@/assets/imgs/Campaign_Banner.png"
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import CreateButton from "@/components/ui/CreateButton/CreateButton";
import { CampaignMemberRole } from "@/types/api/campaignMember";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, X } from "lucide-react";

// TODO: add a loading sequence between fetchCampaigns

const Campaigns = () => {
  const { campaigns, setCampaigns, setActiveCampaignId } = useCampaign()
  const navigate = useNavigate()
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null)
  const [name, setName] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [system, setSystem] = useState<string>("")
  const [deleteText, setDeleteText] = useState<string>("")
  const [editorButton, setEditorButton] = useState<string>("Create")
  const [action, setAction] = useState<string>("")

  const editorRef = useRef<HTMLDivElement>(null)
  const deletionPopupRef = useRef<HTMLDivElement>(null)

  const openEditor = (campaign: Campaign | null) => {
    if (campaign) {
      setAction("Edit")
      setEditorButton("Update")
      setName(campaign?.name)
      setDescription(campaign?.description)
      setSystem(campaign?.system)
      setCurrentCampaign(campaign)
    } else {
      setAction("Create")
      setEditorButton("Create")
    }
    editorRef.current?.style.setProperty("display", "flex")
  }

  const closeEditor = () => {
    editorRef.current?.style.setProperty("display", "none")
  }

  const updateCampaign = () => {
    if (editorButton === "Create") addCampaign()
    else editCampaign()
  }

  const addCampaign = async () => {
    try {
      const response = await fetch("/api/campaigns", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, system }) 
      })
      const campaign = await response.json()
      setCampaigns([...campaigns, campaign])
      // set active campaign
      setActiveCampaignId(String(campaign.id))
      localStorage.setItem("activeCampaignId", String(campaign.id));
      closeEditor()
    } catch (error) {
      console.error("Failed to add new campaign: ", error)
    }
  }

  const selectCampaign = (campaign: Campaign) => {
    setActiveCampaignId(String(campaign.id))
    navigate("/dashboard")
  }

  const editCampaign = async () => {
    if (!currentCampaign) {
      console.error("No current campaign selected.")
      return
    }
    try {
      const response = await fetch(`/api/campaigns/${currentCampaign.id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, system }) 
      })
      const json = await response.json()
      // replace old campaign instance
      setCampaigns((prev) =>
        prev.map((campaign) =>
          campaign.id === json.id ? json : campaign
        )
      )
      closeEditor()
    } catch (error) {
      console.error("Failed to edit campaign: ", error)
    }
  }

  const openDeletionPopup = (campaign: Campaign) => {
    setCurrentCampaign(campaign)
    deletionPopupRef.current?.style.setProperty("display", "flex")
  }

  const closeDeletionPopup = () => {
    deletionPopupRef.current?.style.setProperty("display", "none")
  }

  const deleteCampaign = async () => {
    if (!currentCampaign) {
      console.error("No current campaign selected.")
      return
    }
    if (currentCampaign?.name != deleteText) {
      console.error("Name inputted does not match campaign's name.")
      return
    }
    try {
      await fetch(`/api/campaigns/${currentCampaign.id}`, { method: "DELETE" })
      setCampaigns((prev) =>
        prev.filter((campaign) => campaign.id !== currentCampaign.id)
      )
      closeDeletionPopup()
    } catch (error) {
      console.error("Failed to delete campaign: ", error)
    }
  }

  return (
    <>
      <div className={styles.campaigns_container}>
        <PageHeader title="Campaigns"/>
        {campaigns.length > 0 ? (
          <>
          <CreateButton
            text="Create a new campaign"
            onClick={() => openEditor(null)}
          />
          <div className={styles.campaigns}>
              {campaigns.map((campaign) => (
                <div 
                  key={campaign.id} 
                  className={`${layoutStyles.card} ${styles.campaign}`}
                  onClick={() => selectCampaign(campaign)}
                >
                  <img 
                    className={styles.campaign_image} 
                    src={CampaignBanner} 
                    alt="Campaign banner image"
                  />
                  <div className={styles.campaign_content}>
                    <div className={styles.campaign_text}>
                      <p className={layoutStyles.card_title}>{campaign.name}</p>
                      <hr />
                      <p className={styles.campaign_description}>{campaign.description}</p>
                    </div>
                    <div className={styles.campaign_bottom}>
                      <div className={layoutStyles.card_flex}>
                        <p className={`${styles.role} ${styles[campaign.role]}`}>{campaign.role}</p>
                        <p className={styles.campaign_system}>{campaign.system}</p>
                      </div>
                      {campaign.role === CampaignMemberRole.OWNER && 
                        <div className={styles.campaign_actions}>
                          <Edit
                            className={styles.campaign_edit}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditor(campaign)
                            }} 
                          />
                          <Trash2 
                            className={styles.campaign_trash}
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeletionPopup(campaign)
                            }}
                          />
                        </div>
                      }
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
        ) : (
          <div className={styles.no_results}>
            <div>
              <h2>No Campaigns Found</h2>
              <p>Start your new campaign below!</p>
            </div>
            <CreateButton
              text="Create a new campaign"
              onClick={() => openEditor(null)}
            />
          </div>
        )}
      </div>
      {/* Campaign Editor */}
      <div ref={editorRef} className={styles.campaign_editor}>
        <div className={`${layoutStyles.editor} ${styles.editor_content}`}>
          <div className={layoutStyles.editor_title}>
            <h2>
              {action === "Create" 
                ? <>Creating a <span>campaign</span></>
                : <>Editing: <span>{name}</span></>
              }
            </h2>
            <X
              className={layoutStyles.green_close_icon} 
              onClick={closeEditor}
            />
          </div>
          <p>Name:</p>
          <input 
            type="text" 
            name="name" 
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={layoutStyles.dark_input}
          />
          <p>Description:</p>
          <textarea 
            className={layoutStyles.dark_input}
            name="description" 
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p>System:</p>
          <input 
            type="text" 
            name="system" 
            placeholder="System (ex: D&D 5th Edition)"
            value={system}
            onChange={(e) => setSystem(e.target.value)}
            className={layoutStyles.dark_input}
          />
          <button 
            onClick={updateCampaign}
            className={layoutStyles.green_button}
          >{editorButton}</button>
        </div>
      </div>
      {/* Delete warning message */}
      <div ref={deletionPopupRef} className={styles.campaign_editor}>
        <div className={`${layoutStyles.editor} ${styles.editor_content}`}>
          <div className={layoutStyles.editor_title}>
            <h2><span>Delete</span> Campaign</h2>
            <X
                className={layoutStyles.green_close_icon} 
                onClick={closeDeletionPopup}
              />
          </div>
          <p>Are you sure you want to delete <b>{currentCampaign?.name}</b>?</p>
          <p>If so, please type in the campaign name below and press delete.</p>
          <input 
            type="text"
            name="delete-text"
            placeholder={currentCampaign?.name}
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            autoComplete="off"
            className={layoutStyles.dark_input}
          />
          <button 
            onClick={deleteCampaign}
            className={layoutStyles.green_button}
          >Delete</button>
        </div>
      </div>
    </>
  )
}

export default Campaigns