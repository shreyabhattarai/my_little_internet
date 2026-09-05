"use client"

import { useEffect, useMemo, useState } from "react"
import Modal from "../Modal"
import styles from "./PhotoFrameModal.module.css"
import { photos } from "@/lib/photos"

export default function PhotoFrameModal({ onClose }) {
  const familyPhotos = useMemo(() => {
    const matches = photos.filter((photo) => photo.src.startsWith("/images/family/"))
    return matches.length ? matches : photos
  }, [])

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % familyPhotos.length)
      }
      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + familyPhotos.length) % familyPhotos.length)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [familyPhotos.length])

  const activePhoto = familyPhotos[activeIndex]

  function goPrev() {
    setActiveIndex((prev) => (prev - 1 + familyPhotos.length) % familyPhotos.length)
  }

  function goNext() {
    setActiveIndex((prev) => (prev + 1) % familyPhotos.length)
  }

  return (
    <Modal title="Photo Frame" onClose={onClose}>
      <div className={styles.shell}>
        <p className={styles.helperText}>Top right wall photos from the family album</p>

        <div className={styles.frame}>
          <img
            key={activePhoto.id}
            src={activePhoto.src}
            alt={activePhoto.caption}
            className={styles.mainPhoto}
          />
        </div>

        <div className={styles.captionBlock}>
          <p className={styles.dateLine}>{activePhoto.date} | {activePhoto.location}</p>
          <p className={styles.captionLine}>{activePhoto.caption}</p>
          {activePhoto.memory ? <p className={styles.memoryLine}>Memory: {activePhoto.memory}</p> : null}
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.navButton} onClick={goPrev} aria-label="Show previous photo">
            Prev
          </button>
          <span className={styles.counter}>
            {activeIndex + 1} / {familyPhotos.length}
          </span>
          <button type="button" className={styles.navButton} onClick={goNext} aria-label="Show next photo">
            Next
          </button>
        </div>

        <div className={styles.thumbRow}>
          {familyPhotos.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              className={index === activeIndex ? `${styles.thumb} ${styles.thumbActive}` : styles.thumb}
              onClick={() => setActiveIndex(index)}
              aria-label={`Select photo ${index + 1}`}
            >
              <img src={photo.src} alt={photo.caption} />
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
