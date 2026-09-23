import { Link, useNavigate } from "react-router-dom"
import { HashLink } from "react-router-hash-link";
import QBLogo from "@/assets/qb-logo.png"
import styles from "./Navigation.module.css"
import { useAuth } from "@/context/AuthContext"
import { useRef, useState } from "react"
import ProfilePicture from "@/assets/imgs/profiles/default.png"
import MenuDropdown from "../MenuDropdown/MenuDropdown";
import { ChartBar, LogOut, Map, Settings } from "lucide-react";

export default function Navigation () {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  // For desktop viewing:
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  // For mobile viewing:
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <header>
      <Link className={styles.title} to={"/"}>
        <img className={styles.logo} src={QBLogo} alt="QuestBase" />
        <h1>Quest<span>Base</span></h1>
      </Link>

      {/* DESKTOP VIEWING */}

      <div className={styles.navigation}>
        <HashLink smooth to="/#mission">Mission</HashLink>
        <HashLink smooth to="/#features">Features</HashLink>
        <HashLink smooth to="/#contact">Contact</HashLink>
        {/* <HashLink smooth to="/#support">Support</HashLink> */}
      </div>

      <div className={styles.navigation}>
        {isAuthenticated 
          ? <>
              <div
                ref={triggerRef} 
                className={styles.profile_picture_wrapper}
              >
                <img 
                  src={ProfilePicture} 
                  alt="default profile picture"
                  className={styles.profile_picture} 
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{ transform: "translateY(-5px) translateX(4px)" }}
                />
              </div>
              <MenuDropdown
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                triggerRef={triggerRef}
                textAlign="left"
                style={{ right: "10px"}}
                children={
                  <>
                    <div className={styles.account_info}>
                      <img 
                        src={ProfilePicture} 
                        alt="default profile picture"
                        className={styles.profile_picture} 
                        onClick={() => setMenuOpen(!menuOpen)}
                      />
                      <div>
                        <p className={styles.user_display_name}>{user?.displayName}</p>
                        <p className={styles.user_email}>{user?.email}</p>
                      </div>
                    </div>
                    <hr />
                    <Link to="/dashboard">
                      <ChartBar />
                      <p>Dashboard</p>
                    </Link>
                    <Link to="/campaigns">
                      <Map />
                      <p>Campaigns</p>
                    </Link>
                    <Link to="/settings">
                      <Settings/>
                      <p>Settings</p>
                    </Link>
                    <hr />
                    <Link onClick={() => logout(redirectToLogin)} to="#">
                      <LogOut/>
                      <p>Logout</p>
                    </Link>
                  </>
                }
              />
            </>
          : <Link to="/login">Login</Link>
        }
      </div>

      {/* MOBILE VIEWING */}

      {/* Hamburger */}
      <button
        ref={mobileTriggerRef}
        className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ""}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu */}
      <MenuDropdown
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        triggerRef={mobileTriggerRef}
        style={{ top: 0, marginTop: 0, paddingTop: "50px" }}
        mobile={true}
        textAlign="right"
        children={
          <>
            <Link to="/">Home</Link>
            {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
            <Link to="#mission">Mission</Link>
            <HashLink smooth to="/#contact">Contact</HashLink>
            {/* <Link to="#support">Support</Link> */}
            {isAuthenticated 
              ? <button 
                  className={styles.logout_button} 
                  onClick={() => logout(redirectToLogin)}
                >
                  Logout
                </button>
              : <Link to="/login">Login</Link>
            }
          </>
        }
      >
      </MenuDropdown>

    </header>
  )
}