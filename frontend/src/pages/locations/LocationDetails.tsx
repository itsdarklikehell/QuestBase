import styles from "./Locations.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import detailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import DetailPage from "@/components/ui/DetailPage/DetailPage"
import { useCampaign } from "@/context/campaign/useCampaign"
import { CampaignMemberRole } from "@/types/api/campaignMember"
import { CreateLocationRequest, LocationDetails as LocationDetailsType } from "@/types/api/location"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { DetailDropdownOption } from "@/components/ui/DetailPage/DetailDropdown"
import Loader from "@/components/ui/Loader/Loader"
import DetailNotFound from "@/components/states/DetailNotFound/DetailNotFound"
import DetailPageEditors from "@/components/ui/DetailPageEditors/DetailPageEditors"
import LocationEditor from "./LocationEditor"

export default function LocationDetails () {
  const navigate = useNavigate()
  const { campaigns } = useCampaign()
  const [ owner, setOwner ] = useState<boolean>(false)
  const [ loading, setLoading ] = useState<boolean>(true)

  const { locationId } = useParams()
  const [ location, setLocation ] = useState<LocationDetailsType | null>(null)
  const [ notes, setNotes ] = useState<string>("")
  const [ personalNotes, setPersonalNotes ] = useState<string>("")
  const [ editing, setEditing ] = useState<boolean>(false)
  const [ updating, setUpdating ] = useState<boolean>(false)

  const [ showGeneralEditor, setShowGeneralEditor ] = useState<boolean>(false)
  const [ showPersonalEditor, setShowPersonalEditor ] = useState<boolean>(false)

  useEffect(() => {
    if (campaigns.length > 0 && location?.campaignId) {
      const campaign = campaigns.find((c) => c.id === location.campaignId)
      if (campaign) setOwner(campaign.role === CampaignMemberRole.OWNER)
    }
  },[campaigns, location?.campaignId])

  const fetchLocation = useCallback(async () => {
    if (!locationId) return 
    try {
      const res = await fetch(
        `/api/locations/${locationId}`,
        { method: "GET" }
      )
      if (res.ok) {
        const l = await res.json()
        setLocation(l)
        setNotes(l.notes)
      } else console.error(res)
    } catch (error) {
      console.error("Failed to fetch location: ", error)
    } finally {
      setLoading(false)
    }
  },[locationId])

  useEffect(() => {
    fetchLocation()
  },[fetchLocation])

  // const onAdd = () => {

  // }

  const onUpdate = async (req: CreateLocationRequest) => {
    try {
      setUpdating(true)
      const res = await fetch(`/api/locations/${locationId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req)
      })
      if (res.ok) {
        const l = await res.json()
        setLocation(l)
        setEditing(false)
      } else console.error(res)
    } catch (error) {
      console.error("Failed to update location: ", error)
    } finally {
      setUpdating(false)
    }
  }

  const onDelete = async () => {
    try {
      const res = await fetch(
        `/api/locations/${locationId}`,
        { method: "DELETE" }
      )
      if (res.ok) {
        navigate("/locations")
      } else console.error(res)
    } catch (error) {
      console.error("Failed to delete location: ", error)
    }
  }

  const saveNotes = useCallback(async (notes: string) => {
    try {
      const res = await fetch(`/api/locations/${locationId}/save-notes`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      })
      if (res.ok) {
        const l = await res.json()
        setLocation(l)
      } else {
        console.error(res)
      }
    } catch (error) {
      console.error("Failed to save location notes: ", error)
    }
  }, [locationId])

  useEffect(() => {
    if (owner) {
      const timeout = setTimeout(() => {
        if (!notes) return
        saveNotes(notes)
      }, 1500)

      return () => clearTimeout(timeout)
    }
  }, [notes, saveNotes, owner])

  const dropdownOptions: DetailDropdownOption[] = [
    // { icon: <BookPlus/>, text: "Add to Quest" }
  ]

  return (
    <div className={layoutStyles.page_container}>
      {location ? (
          <DetailPage
            title={location.name}
            dropdownOptions={dropdownOptions}
            editable={owner}
            editting={editing}
            // onAdd={onAdd}
            onEdit={(e) => setEditing(e)}
            onDelete={onDelete}
            children={
              <div className={detailPageStyles.information}>
                {editing ? (
                    <LocationEditor 
                      action="Update"
                      location={location}
                      loading={updating}
                      onTrigger={(l: CreateLocationRequest) => onUpdate(l)}
                      onClose={() => setEditing(false)}
                    />
                ) : (
                    <>
                      <div className={detailPageStyles.traits}>
                        {location.type && 
                          <p className={`${layoutStyles.card_property} ${styles.location_type}`}>
                            {location.type}
                          </p>
                        }
                        {location.status && 
                          <p className={`${layoutStyles.card_property} ${styles.location_status} ${styles[location.status]}`}>
                            {location.status}
                          </p>
                        }
                      </div>
                      {location.description && 
                        <div className={detailPageStyles.text}>
                          <p className={detailPageStyles.text_label}>Description:</p>
                          <p>{location.description}</p>
                        </div>
                      }

                      <hr className={detailPageStyles.section_hr}/>

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
                    </>
                )}
              </div>
            }
          />
      ) : loading ? (
        <Loader />
      ) : (
        <DetailNotFound 
          title={<><span>Location</span> Not Found</>}
          message="This location seems to have vanished from the realm."
          buttonText="Back to locations"
          onClick={() => navigate("/locations")}
        />
      )}
    </div>
  )
}