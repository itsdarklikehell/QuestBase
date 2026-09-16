import CampaignEmptyState from "@/components/states/CampaignEmptyState/CampaignEmptyState";
import CreateButton from "@/components/ui/CreateButton/CreateButton";
import PageHeader from "@/components/ui/PageHeader/PageHeader";
import { useCampaign } from "@/context/campaign/useCampaign";
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useCallback, useEffect, useState } from "react";
import Location from "./Location";
import LocationEditor from "./LocationEditor";
import { CreateLocationRequest, Location as LocationType } from "@/types/api/location";
import { useAuth } from "@/context/AuthContext";


export default function Locations () {
  const { user } = useAuth()
  const { activeCampaign } = useCampaign()

  const [ locations, setLocations ] = useState<LocationType[]>([])
  const [ showEditor, setShowEditor ] = useState<boolean>(false)
  const [ submitting, setSubmitting ] = useState<boolean>(false)

  const fetchLocations = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const response = await fetch(
        `api/campaigns/${activeCampaign.id}/locations`,
        { method: "GET" }
      )
      if (response.ok) {
        const locations = await response.json();
        setLocations(locations);
      } else console.error(response)
    } catch (error) {
      console.error("Failed to fetch locations: ", error)
    }
  },[activeCampaign?.id])

  useEffect(() => {
    if (user && activeCampaign?.id) {
      fetchLocations()
    }
  }, [user, activeCampaign, fetchLocations])

  const createLocation = async (location: CreateLocationRequest) => {
    try {
      setSubmitting(true)
      validate(location)
      console.log('location: ', location)
      const response = await fetch('/api/locations', { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(location)
      })
      if (response.ok) {
        const newLocation = await response.json()
        setLocations([...locations, newLocation])
        setShowEditor(false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create location: ", error)
    } finally {
      setSubmitting(false)
    }
  }

  const validate = (location: CreateLocationRequest) => {
      if (!location.name) throw new Error("A name is required.")
      else if (!location.campaignId) throw new Error("A campaign ID is required.")
    }

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader title="Locations" activeCampaign={activeCampaign}/>
      {showEditor && 
        <LocationEditor
          action="Create"
          loading={submitting}
          onTrigger={
            (location: CreateLocationRequest) => createLocation(location)
          }
          onClose={() => setShowEditor(false)}
        />}
      {!activeCampaign ? (
        <CampaignEmptyState type={"Locations"} />
      ) : locations.length > 0 ? (
        <>
          {!showEditor && <CreateButton
            text="Create a Location"
            onClick={() => setShowEditor(!showEditor)}
          />}
          {locations.map((location) => (
            <Location
              location={location}
            />
          ))}
        </>
      ) : (
        <>
          {!showEditor && 
            <div className={layoutStyles.no_results}>
              <div>
                <h2>No Locations Found</h2>
                <p>Create a new location for your campaign below!</p>
              </div>
              <CreateButton
                text="Create a Location"
                onClick={() => setShowEditor(!showEditor)}
              />
            </div>
          }
        </>
      )}
    </div>
  )
}