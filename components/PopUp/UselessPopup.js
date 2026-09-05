"use client"

import { useEffect } from "react"
import styles from "./UselessPopup.module.css"

export default function UselessPopup({ message, onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [onDone])

  return <div className={styles.toast}>{message}</div>
}
