import { Location as LocationType } from "@/types/api/location"
import styles from "./Locations.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { useNavigate } from "react-router-dom"

interface LocationProps {
  location: LocationType
}

export default function Location ({
  location
}: LocationProps) {
  const navigate = useNavigate()

  return (
    <div
      className={layoutStyles.card}
      onClick={() => navigate(`/locations/${location.id}`)}
    >
      <div className={layoutStyles.card_header}>
        <h2>{location.name}</h2>
        <div className={layoutStyles.card_properties}>
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
      </div>
    </div>
  )
}