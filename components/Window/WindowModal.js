"use client"

import { useMemo } from "react"
import Modal from "../Modal"
import styles from "./WindowModal.module.css"
import { WINDOW_VIEWS } from "@/lib/worldConfig"

const OPTIONS = ["day", "dusk", "night"]

export default function WindowModal({ onClose, period, overridePeriod, onOverridePeriod }) {
  const activeView = useMemo(() => {
    if (OPTIONS.includes(overridePeriod)) return overridePeriod
    if (OPTIONS.includes(period)) return period
    return "day"
  }, [overridePeriod, period])

  const activeIndex = OPTIONS.indexOf(activeView)
  const viewSrc = WINDOW_VIEWS[activeView] || WINDOW_VIEWS.day
  const activeLabel = activeView === "dusk" ? "dusk or dawn" : activeView

  function shiftView(step) {
    const nextIndex = (activeIndex + step + OPTIONS.length) % OPTIONS.length
    onOverridePeriod?.(OPTIONS[nextIndex])
  }

  return (
    <Modal title="Window" onClose={onClose}>
      <p className={styles.helperText}>outside view: {activeLabel}</p>

      <div className={styles.viewer} role="group" aria-label="window view picker">
        <button
          type="button"
          className={styles.arrowButton}
          aria-label="Show previous window view"
          onClick={() => shiftView(-1)}
        >
          <span aria-hidden="true">&lt;</span>
        </button>

        <img src={viewSrc} alt={`${activeLabel} view through the window`} className={styles.previewImage} />

        <button
          type="button"
          className={styles.arrowButton}
          aria-label="Show next window view"
          onClick={() => shiftView(1)}
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>

      <p className={styles.caption}>{activeIndex + 1} / {OPTIONS.length}</p>
    </Modal>
  )
}