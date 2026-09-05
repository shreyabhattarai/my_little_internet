"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./page.module.css"
import RoomCanvas from "@/components/RoomCanvas"
import AccessibilityDrawer from "@/components/Drawer/AccessibilityDrawer"
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

export default function HomePage() {
  const [openModal, setOpenModal] = useState(null)
  const [popup, setPopup] = useState(null)
  const [secret, setSecret] = useState(null)
  const [realTimePeriod, setRealTimePeriod] = useState("day")
  const [windowOverride, setWindowOverride] = useState("auto")
  // Future addition:
  // const [counterClicks, setCounterClicks] = useState(0)
  // const drawerClicksRef = useRef(0)
  const sequenceProgressRef = useRef(0)
  const activePeriod =
    windowOverride === "auto" ? realTimePeriod : getEffectivePeriod(windowOverride, new Date())

  useEffect(() => {
    function updatePeriod() {
      setRealTimePeriod(getTimePeriod(new Date()))
    }
    updatePeriod()
    const id = setInterval(updatePeriod, 60000)
    return () => clearInterval(id)
  }, [])

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
      <RoomCanvas
        onZoneModal={handleZoneModal}
        onZoneUseless={handleZoneUseless}
        period={activePeriod}
      />

      <AccessibilityDrawer onOpenModal={handleZoneModal} />

      {openModal === "computer" && <ComputerModal onClose={() => setOpenModal(null)} />}
      {openModal === "music" && <MusicPlayer onClose={() => setOpenModal(null)} />}
      {openModal === "feed" && <LifeFeed onClose={() => setOpenModal(null)} />}
      {openModal === "bookshelf" && <BookshelfModal onClose={() => setOpenModal(null)} />}
      {/* Future addition: wardrobe and bed modals */}
      {/* {openModal === "wardrobe" && <WardrobeModal onClose={() => setOpenModal(null)} />} */}
      {/* {openModal === "bed" && <BedModal onClose={() => setOpenModal(null)} />} */}
      {openModal === "arcade" && <ArcadeModal onClose={() => setOpenModal(null)} />}
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
