"use client"

import styles from "./StatusBar.module.css"
import { currentStatus } from "@/lib/mood"

export default function StatusBar() {
  return (
    <div className={styles.bar}>
      <span className={styles.chip}>
        mood <strong>{currentStatus.mood}</strong>
      </span>
      <span className={styles.chip}>
        energy <strong>{currentStatus.energy}</strong>
      </span>
      <span className={styles.chip}>
        obsessed with <strong>{currentStatus.currentObsession}</strong>
      </span>
      <span className={styles.chip}>
        listening to <strong>{currentStatus.currentMusic}</strong>
      </span>
    </div>
  )
}
