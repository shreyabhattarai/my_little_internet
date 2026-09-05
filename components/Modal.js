"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import styles from "./Modal.module.css"

const MODAL_TRANSITION_MS = 320

export default function Modal({ title, onClose, children }) {
  const panelRef = useRef(null)
  const closeTimerRef = useRef(null)
  const [isClosing, setIsClosing] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const requestClose = useCallback(() => {
    if (isClosing) return

    if (prefersReducedMotion) {
      onClose()
      return
    }

    setIsClosing(true)
    closeTimerRef.current = setTimeout(() => {
      onClose()
    }, MODAL_TRANSITION_MS)
  }, [isClosing, onClose, prefersReducedMotion])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") requestClose()
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncReducedMotion = () => setPrefersReducedMotion(mediaQuery.matches)
    syncReducedMotion()

    window.addEventListener("keydown", handleKey)
    mediaQuery.addEventListener("change", syncReducedMotion)
    panelRef.current?.focus()
    return () => {
      window.removeEventListener("keydown", handleKey)
      mediaQuery.removeEventListener("change", syncReducedMotion)
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
        closeTimerRef.current = null
      }
    }
  }, [requestClose])

  return (
    <div className={isClosing ? `${styles.overlay} ${styles.overlayClosing}` : `${styles.overlay} ${styles.overlayOpen}`} onMouseDown={(e) => {
      if (e.target === e.currentTarget) requestClose()
    }}>
      <div
        className={isClosing ? `${styles.panel} ${styles.panelClosing}` : `${styles.panel} ${styles.panelOpen}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
      >
        <button className={styles.closeButton} onClick={requestClose} aria-label="Close">
          x
        </button>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
      </div>
    </div>
  )
}
