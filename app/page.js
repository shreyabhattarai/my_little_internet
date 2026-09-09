"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./page.module.css"
import RoomCanvas from "@/components/room/RoomCanvas"
import LifeFeed from "@/components/desk/LifeFeed"
import BookshelfModal from "@/components/bookshelf/BookshelfModal"
// Future addition:
// import WardrobeModal from "@/components/future/WardrobeModal"
// import BedModal from "@/components/future/BedModal"
// import BrainrotModal from "@/components/future/BrainrotModal"
import UselessPopup from "@/components/popup/UselessPopup"
import SecretModal from "@/components/secret/SecretModal"
import { SECRET_KEY_SEQUENCE, getEffectivePeriod, getTimePeriod } from "@/lib/worldConfig"
import { getRandomResponse } from "@/lib/useless"
import { secretKeySequenceReward } from "@/lib/secrets"
import { startDefaultSpeakerLoop } from "@/lib/speakerPlayer"

const FULLSCREEN_STORAGE_KEY = "mli-fullscreen-enabled"
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

export default function HomePage() {
  const [openModal, setOpenModal] = useState(null)
  const [popup, setPopup] = useState(null)
  const [secret, setSecret] = useState(null)
  const [realTimePeriod, setRealTimePeriod] = useState("day")
  const [windowOverride, setWindowOverride] = useState("auto")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false)
  const [isFullscreenPreferenceEnabled, setIsFullscreenPreferenceEnabled] = useState(true)
  // gates the fullscreen button until the room finishes loading
  const [isRoomReady, setIsRoomReady] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  // Future addition:
  // const [counterClicks, setCounterClicks] = useState(0)
  // const drawerClicksRef = useRef(0)
  const sequenceProgressRef = useRef(0)
  const defaultAudioStartedRef = useRef(false)
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
      // ignore exit errors, keep the button usable
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

  // Respect the user's OS level reduced motion preference everywhere in the room
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY)

    setReducedMotion(query.matches)

    function handleChange(event) {
      setReducedMotion(event.matches)
    }

    query.addEventListener("change", handleChange)
    return () => query.removeEventListener("change", handleChange)
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

  // starts the ambient loop on first interaction
  useEffect(() => {
    async function loadPlaylistsAndStart() {
      try {
        const response = await fetch("/api/audio")
        const data = await response.json()
        const sourcePlaylists = Array.isArray(data.playlists) ? data.playlists : []
        startDefaultSpeakerLoop(sourcePlaylists)
      } catch {
        // no audio library available yet, stay silent
      }
    }

    function handleFirstStep() {
      if (defaultAudioStartedRef.current) {
        return
      }

      defaultAudioStartedRef.current = true
      void loadPlaylistsAndStart()
    }

    window.addEventListener("pointerdown", handleFirstStep, { once: true })
    window.addEventListener("keydown", handleFirstStep, { once: true })

    return () => {
      window.removeEventListener("pointerdown", handleFirstStep)
      window.removeEventListener("keydown", handleFirstStep)
    }
  }, [])

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
        reducedMotion={reducedMotion}
        onReady={handleRoomReady}
        onOverridePeriod={setWindowOverride}
      />

      {openModal === "feed" && <LifeFeed onClose={() => setOpenModal(null)} />}
      {openModal === "bookshelf" && <BookshelfModal onClose={() => setOpenModal(null)} />}
      {/* Future addition: wardrobe, bed and internet modals */}
      {/* {openModal === "wardrobe" && <WardrobeModal onClose={() => setOpenModal(null)} />} */}
      {/* {openModal === "bed" && <BedModal onClose={() => setOpenModal(null)} />} */}
      {/* {openModal === "brainrot" && <BrainrotModal onClose={() => setOpenModal(null)} />} */}
      {popup && <UselessPopup message={popup} onDone={() => setPopup(null)} />}
      {secret && <SecretModal secret={secret} onClose={() => setSecret(null)} />}
    </main>
  )
}
