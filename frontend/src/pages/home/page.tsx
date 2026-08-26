import styles from "./page.module.css"
import FrogWizardImage from "@/assets/imgs/QB_Froggo_Wizard.png"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import MediumSparkle from "@/assets/svgs/medium-sparkle.svg?react"
import LargeSparkle from "@/assets/svgs/large-sparkle.svg?react"
import { Book, BookUser, CircleAlert, CircleX, FolderGit2, Map, PartyPopper, Send, Sparkle, UsersRound } from "lucide-react"
import React, { useEffect, useState } from "react"
import { HashLink } from "react-router-hash-link";
import Loader from "@/components/ui/Loader/Loader"
import MissionImg from "@/assets/imgs/mission-img.png"
import authLayoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"

function Home() {
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [turnstileToken, setTurnstileToken] = useState<string>("")
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")

  const features = [
    {
      icon: <Map/>,
      color: "var(--qb-mimic-coin)",
      title: "Campaigns",
      description: "Give every adventure a home. Keep your quests, characters, notes, and campaign details organized in one shared space."
    },
    { 
      icon: <BookUser/>,
      color: "var(--qb-alien-green)",
      title: "NPCs", 
      description: "Build memorable NPCs with their roles, personalities, details, and notes all in one place." 
    },
    { 
      icon: <Book/>,
      color: "var(--qb-blue-slime)",
      title: "Quests", 
      description: "Create and organize quests, track their progress, set rewards, and keep every adventure moving forward." 
    },
    { 
      icon: <UsersRound/>,
      color: "var(--qb-periwinkle)",
      title: "Players", 
      description: "Invite players to your campaign and share the adventures, characters, and stories that bring your world to life." 
    }
  ]

  useEffect(() => {
    window.onTurnstileSuccess = (token: string) => {
      setTurnstileToken(token)
    }
    window.onTurnstileExpired = () => {
      setTurnstileToken("")
    }
    return () => {
      delete window.onTurnstileSuccess
      delete window.onTurnstileExpired
    }
  }, [])

  const sendMessage = async () => {
    setErrorMessage("")
    setSuccessMessage("")

    if (!turnstileToken) {
      setErrorMessage("Please complete the security check.")
      return
    }

    if (!message) {
      setErrorMessage("Please write a message.")
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, turnstileToken })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Unable to send message.")
      }
      console.log(data.message)
      handleMessageSent()
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Your message could not be sent."
      )
      console.error("Failed to send message: ", error)
    } finally {
      setSubmitting(false)
      setTurnstileToken("")
      window.turnstile?.reset()
    }
  }

  const handleMessageSent = () => {
    setName("")
    setEmail("")
    setMessage("")
    setSuccessMessage("Message Sent!")
  }

  return (
    <div className={styles.home_page}>

      <section className={styles.hero}>
        <div className={styles.hero_text_cont}>
          <SmallSparkle className={styles.small_sparkle_1}/>
          <MediumSparkle className={styles.medium_sparkle_1}/>
          <LargeSparkle className={styles.large_sparkle_1}/>
          <SmallSparkle className={styles.small_sparkle_2}/>
          <MediumSparkle className={styles.medium_sparkle_2}/>
          <h1>Org<span>a</span>nize Every <span className={styles.green_text}>ADVENTURE</span>.</h1>
          <p>QuestBase keeps your campaigns, quests, NPCs, and session notes together so you're always ready for game night!</p>
          <HashLink 
            smooth 
            to="/#features"
            className={styles.sparkle_button}
          >
            <Sparkle className={styles.sparkle_icon} />
            <p>Learn more</p>
          </HashLink>
        </div>
        <div className={styles.hero_image_cont}>
          <img 
            src={FrogWizardImage} 
            alt="Illustration of a cute frog wizard holding a stick wand glowing pink and a tadpole egg with a purple aura around him with three tadpoles floating in it."
            className={styles.hero_image}
          />
        </div>
      </section>

      <section id="mission" className={styles.mission}>
        <div className={styles.mission_text_box}>
          <h1>Our <span>Mission</span></h1>
          <p>
            QuestBase is a{" "}
            <span>campaign management platform</span>
            {" "}built for Dungeon Masters running virtual tabletop RPG campaigns. It provides a centralized place to organize <span>quests</span>, track <span>party progress</span>, manage <span>session notes</span>, and keep important campaign details in one place.</p>
          <br />
          <p>
            As the project evolves, QuestBase aims to become a hub for creating and sharing{" "}
            <span>homebrew content</span>
            , building{" "}
            <span>reusable campaign templates</span>
            , and managing multiple campaigns from a single platform.
          </p>
        </div>
        <div className={styles.mission_image_wrapper}>
          <img src={MissionImg} />
        </div>
      </section>

      <section id="features" className={styles.features}>
        <h1>Features</h1>
        <div className={styles.features_container}>
          {features.map((feat) => (
            <div 
              className={`${authLayoutStyles.card} ${styles.features_card}`}
              style={{ borderColor: feat.color }}
            >
              <div className={styles.features_header}>
                {React.cloneElement(feat.icon, {
                  size: "30",
                  style: { stroke: feat.color }
                })}
                <h3 style={{ color: feat.color }}>{feat.title}</h3>
              </div>
              <p>{feat.description}</p>
            </div>
          ))}
        </div>
        <div className={styles.message}>
          <CircleAlert color={"#adff5d"} size={25}/>
          <p>QuestBase is in early development.</p>
        </div>
      </section>
      <div className={styles.features_blob_container}></div>

      <section id="contact" className={styles.contact}>
        <div className={styles.contact_text_container}>
          <div className={styles.contact_text}>
            <h1>Contact <span>Us</span></h1>
            <p>Have a <span>question</span>, found a <span>bug</span>, or have an <span>idea</span> for QuestBase?</p>
            <p>We'd love to hear from you. Feel free to reach out anytime at{" "}<a href="mailto:support@questbase.net">support@questbase.net</a></p>
          </div>
          <div className={styles.project_link}>
            <FolderGit2 color={"var(--qb-alien-green)"} size={25}></FolderGit2>
            <p><a href="https://github.com/Cthomp7/QuestBase" target="_blank">https://github.com/Cthomp7/QuestBase</a></p>
          </div>
        </div>
        <div className={styles.contact_form_container}>
          <p>Name</p>
          <input 
            type="text"
            name="name"
            className={styles.dark_input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ribbert Muddles"
          />
          <p>Email</p>
          <input
            type="text"
            name="email"
            className={styles.dark_input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ribbert@wobblewizards.com"
          />
          <p>Message</p>
          <textarea 
            name="form-message" 
            className={styles.dark_input}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain your quest, bug, or creative idea..."
          ></textarea>
          <div
            className="cf-turnstile"
            data-sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            data-callback="onTurnstileSuccess"
            data-expired-callback="onTurnstileExpired"
            style={{ marginTop: "10px"}}
          ></div>
          <div className={styles.button_error_container}>
            {submitting 
            ? <Loader/>
            : <div className={styles.green_button} onClick={sendMessage}>
                <Send></Send>
                <p>Send</p>
              </div>
            }
            {errorMessage && 
              <div className={`${styles.message} ${styles.error_message}`}>
                <CircleX color={"#ff5d5d"} size={25}/>
                <p>{errorMessage}</p>
              </div>
            }
            {successMessage && 
              <div className={`${styles.message} ${styles.success_message}`}>
                <PartyPopper color={"var(--qb-alien-green)"} size={25}/>
                <p>{successMessage}</p>
              </div>
            }
          </div>
        </div>
      </section>
      
      <script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
      ></script>
    </div>
  );
}

export default Home;
