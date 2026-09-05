"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./page.module.css"
import RoomCanvas from "@/components/RoomCanvas"
import ComputerModal from "@/components/Computer/ComputerModal"
import MusicPlayer from "@/components/MusicPlayer"
import LifeFeed from "@/components/LifeFeed"
import BookshelfModal from "@/components/BookShelf/BookshelfModal"
// Future addition:
// import WardrobeModal from "@/components/WardRobe/WardrobeModal"
// import BedModal from "@/components/Bed/BedModal"
import ArcadeModal from "@/components/Gaming/ArcadeModal"
// Future addition:
// import BrainrotModal from "@/components/Gaming/BrainrotModal"
import WindowModal from "@/components/Window/WindowModal"
import UselessPopup from "@/components/PopUp/UselessPopup"
import SecretModal from "@/components/SecretModal"
import { SECRET_KEY_SEQUENCE, getEffectivePeriod, getTimePeriod } from "@/lib/worldConfig"
import { getRandomResponse } from "@/lib/useless"
import { secretKeySequenceReward, hiddenRoom } from "@/lib/secrets"

const FULLSCREEN_STORAGE_KEY = "mli-fullscreen-enabled"

export default function HomePage() {
  const [openModal, setOpenModal] = useState(null)
  const [popup, setPopup] = useState(null)
  const [secret, setSecret] = useState(null)
  const [realTimePeriod, setRealTimePeriod] = useState("day")
  const [windowOverride, setWindowOverride] = useState("auto")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false)
  const [isFullscreenPreferenceEnabled, setIsFullscreenPreferenceEnabled] = useState(true)
  // true once the room has finished loading its assets, gates the fullscreen button
  const [isRoomReady, setIsRoomReady] = useState(false)
  // Future addition:
  // const [counterClicks, setCounterClicks] = useState(0)
  // const drawerClicksRef = useRef(0)
  const sequenceProgressRef = useRef(0)
  const activePeriod =
    windowOverride === "auto" ? realTimePeriod : getEffectivePeriod(windowOverride, new Date())

  const requestFullscreen = useCallback(async () => {
    if (!document.fullscreenEnabled || !document.documentElement.requestFullscreen) {
      return false
    }

    try {
      await document.documentElement.requestFullscreen()
      return true
    } catch {
      return false
    }
  }, [])

  const exitFullscreen = useCallback(async () => {
    if (!document.exitFullscreen || !document.fullscreenElement) {
      return
    }

    try {
      await document.exitFullscreen()
    } catch {
      // Ignore exit errors and keep button usable.
    }
  }, [])

  useEffect(() => {
    function updatePeriod() {
      setRealTimePeriod(getTimePeriod(new Date()))
    }
    updatePeriod()
    const id = setInterval(updatePeriod, 60000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const canFullscreen = Boolean(
      document.fullscreenEnabled &&
        document.documentElement.requestFullscreen &&
        document.exitFullscreen
    )

    const savedPreference = window.localStorage.getItem(FULLSCREEN_STORAGE_KEY)
    const shouldAutoEnter = savedPreference !== "false"

    setIsFullscreenSupported(canFullscreen)
    setIsFullscreenPreferenceEnabled(shouldAutoEnter)
    setIsFullscreen(Boolean(document.fullscreenElement))

    function handleFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    if (canFullscreen && shouldAutoEnter && !document.fullscreenElement) {
      void requestFullscreen()
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [requestFullscreen])

  useEffect(() => {
    if (!isFullscreenSupported || isFullscreen || !isFullscreenPreferenceEnabled) {
      return
    }

    async function attemptFullscreenOnInteraction() {
      await requestFullscreen()
    }

    window.addEventListener("pointerdown", attemptFullscreenOnInteraction, { once: true })
    window.addEventListener("keydown", attemptFullscreenOnInteraction, { once: true })

    return () => {
      window.removeEventListener("pointerdown", attemptFullscreenOnInteraction)
      window.removeEventListener("keydown", attemptFullscreenOnInteraction)
    }
  }, [isFullscreen, isFullscreenPreferenceEnabled, isFullscreenSupported, requestFullscreen])

  useEffect(() => {
    document.body.dataset.theme = activePeriod
  }, [activePeriod])

  // Listen for the hidden keyboard sequence anywhere on the page
  useEffect(() => {
    function handleKeyDown(e) {
      const expected = SECRET_KEY_SEQUENCE[sequenceProgressRef.current]
      if (e.key === expected) {
        sequenceProgressRef.current += 1
        if (sequenceProgressRef.current === SECRET_KEY_SEQUENCE.length) {
          sequenceProgressRef.current = 0
          setSecret(secretKeySequenceReward)
        }
      } else {
        sequenceProgressRef.current = e.key === SECRET_KEY_SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  function handleZoneModal(modalId) {
    setOpenModal(modalId)
  }

  function handleZoneUseless(uselessId) {
    // Future addition:
    // if (uselessId === "counter") {
    //   setCounterClicks((prev) => {
    //     const next = prev + 1
    //     setPopup(getRandomResponse("counter").replace("{n}", String(next)))
    //     return next
    //   })
    //   return
    // }
    setPopup(getRandomResponse(uselessId))
  }

  async function handleFullscreenToggle() {
    if (!isFullscreenSupported) {
      return
    }

    if (document.fullscreenElement || isFullscreen) {
      window.localStorage.setItem(FULLSCREEN_STORAGE_KEY, "false")
      setIsFullscreenPreferenceEnabled(false)
      await exitFullscreen()
      return
    }

    window.localStorage.setItem(FULLSCREEN_STORAGE_KEY, "true")
    setIsFullscreenPreferenceEnabled(true)
    await requestFullscreen()
  }

  function handleRoomReady() {
    setIsRoomReady(true)
  }

  // Future addition:
  // function handleDrawerClick() {
  //   drawerClicksRef.current += 1
  //   if (drawerClicksRef.current >= DRAWER_CLICKS_NEEDED) {
  //     drawerClicksRef.current = 0
  //     setSecret(drawerSecret)
  //   } else {
  //     setPopup("the drawer sticks a little, " + drawerClicksRef.current + " of " + DRAWER_CLICKS_NEEDED)
  //   }
  // }

  return (
    <main className={styles.page}>
      {isFullscreenSupported && isRoomReady && (
        <button
          type="button"
          className={styles.fullscreenToggle}
          onClick={handleFullscreenToggle}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          aria-pressed={isFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <span
            className={isFullscreen ? styles.fullscreenIconExit : styles.fullscreenIconEnter}
            aria-hidden="true"
          />
        </button>
      )}

      <RoomCanvas
        onZoneModal={handleZoneModal}
        onZoneUseless={handleZoneUseless}
        period={activePeriod}
        onReady={handleRoomReady}
      />

      {openModal === "computer" && <ComputerModal onClose={() => setOpenModal(null)} />}
      {openModal === "music" && <MusicPlayer onClose={() => setOpenModal(null)} />}
      {openModal === "feed" && <LifeFeed onClose={() => setOpenModal(null)} />}
      {openModal === "bookshelf" && <BookshelfModal onClose={() => setOpenModal(null)} />}
      {/* Future addition: wardrobe and bed modals */}
      {/* {openModal === "wardrobe" && <WardrobeModal onClose={() => setOpenModal(null)} />} */}
      {/* {openModal === "bed" && <BedModal onClose={() => setOpenModal(null)} />} */}
      {/* Future addition: internet modal */}
      {/* {openModal === "brainrot" && <BrainrotModal onClose={() => setOpenModal(null)} />} */}
      {openModal === "window" && (
        <WindowModal
          onClose={() => setOpenModal(null)}
          period={activePeriod}
          overridePeriod={windowOverride}
          onOverridePeriod={setWindowOverride}
        />
      )}
      {popup && <UselessPopup message={popup} onDone={() => setPopup(null)} />}
      {secret && <SecretModal secret={secret} onClose={() => setSecret(null)} />}
    </main>
  )
}