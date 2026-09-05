"use client"

import Modal from "../Modal"
import shared from "../panelContent.module.css"
import { bedContent } from "@/lib/rooms"
import { isLateNight } from "@/lib/worldConfig"

export default function BedModal({ onClose }) {
  const lateNight = isLateNight(new Date())

  return (
    <Modal title="Bed" onClose={onClose}>
      <p className={shared.smallText}>current state, {bedContent.currentState}</p>
      <ul className={shared.list}>
        {bedContent.sleepFacts.map((fact, i) => (
          <li key={i} className={shared.item}>
            <p className={shared.itemNote}>{fact}</p>
          </li>
        ))}
      </ul>
      <p className={shared.smallText}>{bedContent.randomFact}</p>
      {lateNight && (
        <p className={shared.smallText} style={{ color: "#e8a0bf", marginTop: 12 }}>
          it is very late where you are, maybe go to sleep
        </p>
      )}
    </Modal>
  )
}
