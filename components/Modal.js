"use client"

import { useEffect, useRef } from "react"
import styles from "./Modal.module.css"

export default function Modal({ title, onClose, children }) {
  const panelRef = useRef(null)

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    panelRef.current?.focus()
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    <div className={styles.overlay} onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={panelRef}
      >
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          x
        </button>
        {title ? <h2 className={styles.title}>{title}</h2> : null}
        {children}
      </div>
    </div>
  )
}
