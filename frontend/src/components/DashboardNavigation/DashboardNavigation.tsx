import { Link, useNavigate } from "react-router-dom"
import styles from "./DashboardNavigation.module.css"
import { useState } from "react"
import { useCampaign } from "@/context/campaign/useCampaign"
import ProfilePicture from "@/assets/imgs/profiles/default.png"
import { useAuth } from "@/context/AuthContext"
import MenuDropdown from "../MenuDropdown/MenuDropdown"
import { ArrowLeft, Book, BookUser, ChartBar, ChevronDown, FolderBookmark, Locate, LogOut, Map, Settings, UsersRound } from "lucide-react"
import { CampaignMemberRole } from "@/types/api/campaignMember"

const DashboardNavigation = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  const { campaigns, activeCampaign, setActiveCampaignId } = useCampaign()
  const [ showDropdown, setShowDropdown ] = useState<boolean>(false)
  const [ accountMenuOpen, setAccountMenuOpen ] = useState(false)

  const pages = [
    { icon: <Locate />, name: "Locations", url: "/locations", access: "ALL" },
    { icon: <BookUser />, name: "NPCs", url: "/npcs", access: "ALL" },
    { icon: <UsersRound/>, name: "Players", url: "/players", access: "ADMIN" },
    { icon: <Book /> , name: "Quests", url: "/quests", access: "ALL" }
  ]

  const switchCampaign = (id: string) => {
    setActiveCampaignId(id)
    localStorage.setItem("activeCampaign", id);
  }

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <div className={styles.dashboard_navigation}>
      <div>
        <section className={styles.dashboard_header}>
          <div className={styles.dashboard_header_qb}>
            <ArrowLeft className={styles.qb_arrow}/>
            <Link to="/"><h1>Quest<span>Base</span></h1></Link>
          </div>
          <div className={styles.dashboard_user_navigation}>
            <img 
              src={ProfilePicture} 
              alt="default profile picture"
              className={styles.profile_picture} 
              onClick={() => setAccountMenuOpen(!accountMenuOpen)}
            />
            <div className={styles.tooltip}>Open user navigation menu</div>
          </div>
          <MenuDropdown
            open={accountMenuOpen}
            style={{ 
              top: 0,
              left: '100%', 
              margin: "0 0 0 20px",
              width: "100%"
            }}
            children={
              <>
                <div className={styles.account_info}>
                  <img 
                    src={ProfilePicture} 
                    alt="default profile picture"
                    className={styles.profile_picture}
                  />
                  <div>
                    <p className={styles.user_display_name}>{user?.displayName}</p>
                    <p className={styles.user_email}>{user?.email}</p>
                  </div>
                </div>
                <hr />
                <Link 
                  to="/settings"
                  onClick={() => setAccountMenuOpen(false)}
                >
                  <Settings/>
                  <p>Settings</p>
                </Link>
                <Link onClick={() => logout(redirectToLogin)} to="#">
                  <LogOut />
                  <p>Logout</p>
                </Link>
              </>
            }
          ></MenuDropdown>
        </section>

        <section className={styles.navigation_section}>
          <div>
            <p className={styles.navigation_header}>GENERAL</p>
            <div
              className={styles.navigation_page}
              onClick={() => navigate("/dashboard")}
            >
              <ChartBar />
              <p>Dashboard</p>
            </div>
            <div
              className={styles.navigation_page}
              onClick={() => navigate("/campaigns")}
            >
              <Map />
              <p>Campaigns</p>
            </div>
          </div>
        </section>

        <section className={styles.navigation_section}>
          <p className={styles.navigation_header}>RESOURCES</p>
          {pages
            .filter((p) => 
              activeCampaign?.role === CampaignMemberRole.OWNER || p.access === "ALL"
            )
            .map((p) => (
            <div
              key={p.url}
              className={styles.navigation_page}
              onClick={() => navigate(p.url)}
            >
              {p.icon}
              <p>{p.name}</p>
            </div>
          ))}
        </section>
        <p 
          style={{ marginTop: "20px"}}
          className={styles.navigation_header}
        >MORE COMING SOON...</p>
        
      </div>

      <div>
        <p className={styles.navigation_header}>ACTIVE CAMPAIGN</p>
        <div 
          className={styles.active_campaign_section}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {(campaigns.length > 1 || !activeCampaign) 
            && <ChevronDown className={showDropdown ? styles.flip : ""}/>}
          <p>{activeCampaign?.name ?? "NOT SELECTED"}</p>
          {showDropdown && (campaigns.length > 1 || !activeCampaign) && 
            <div className={styles.campaign_dropdown}>
                {campaigns.map((campaign) => (
                  activeCampaign != campaign 
                    ? <div 
                        className={styles.campaign_dropdown_option}
                        onClick={() => switchCampaign(String(campaign.id))}
                      >
                        <FolderBookmark/>
                        <p>{campaign.name}</p>
                      </div>
                    : <></>
                ))}
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default DashboardNavigation