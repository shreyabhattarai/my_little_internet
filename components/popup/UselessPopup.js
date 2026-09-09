"use client"

import { useEffect, useState } from "react"
import styles from "./UselessPopup.module.css"

const VISIBLE_MS = 2200
const EXIT_MS = 260

export default function UselessPopup({ message, onDone }) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = setTimeout(() => setIsLeaving(true), VISIBLE_MS)
    return () => clearTimeout(leaveTimer)
  }, [])

  useEffect(() => {
    if (!isLeaving) return
    const doneTimer = setTimeout(onDone, EXIT_MS)
    return () => clearTimeout(doneTimer)
  }, [isLeaving, onDone])

  return (
    <div
      className={`${styles.toast} ${isLeaving ? styles.toastLeaving : styles.toastEntering}`}
      role="status"
    >
      {message}
    </div>
  )
}
