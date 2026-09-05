"use client"

import Modal from "../Modal"
import shared from "../panelContent.module.css"
import { WINDOW_VIEWS } from "@/lib/worldConfig"

const OPTIONS = ["auto", "day", "dusk", "night"]

export default function WindowModal({ onClose, period, overridePeriod, onOverridePeriod }) {
  const viewSrc = WINDOW_VIEWS[period] || WINDOW_VIEWS.day
  const periodLabel = period === "dusk" ? "dusk or dawn" : period

  return (
    <Modal title="Window" onClose={onClose}>
      <p className={shared.smallText}>the outside is currently {periodLabel}</p>
      <img
        src={viewSrc}
        alt="View through the window"
        style={{ width: "100%", borderRadius: 10, display: "block", margin: "8px 0 12px" }}
      />
      <p className={shared.smallText}>switch view manually any time or keep it on auto</p>
      <div className={shared.buttonRow} role="group" aria-label="window view mode">
        {OPTIONS.map((option) => {
          const active = overridePeriod === option
          return (
            <button
              key={option}
              type="button"
              className={shared.button}
              onClick={() => onOverridePeriod(option)}
              aria-pressed={active}
              style={active ? { borderColor: "var(--color-lamp)", color: "var(--color-lamp)" } : undefined}
            >
              {option}
            </button>
          )
        })}
      </div>
      <p className={shared.smallText}>
        sometimes the best part of the room is looking at something that is not in the room
      </p>
    </Modal>
  )
}