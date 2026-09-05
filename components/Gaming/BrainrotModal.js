"use client"

import { useState } from "react"
import Modal from "../Modal"
import shared from "../panelContent.module.css"
import { brainrotItems, brainrotSoundLabel } from "@/lib/brainrot"

export default function BrainrotModal({ onClose }) {
  const [soundText, setSoundText] = useState("")

  return (
    <Modal title="The Internet, absolutely nothing important" onClose={onClose}>
      <ul className={shared.list}>
        {brainrotItems.map((item) => (
          <li key={item.id} className={shared.item}>
            <p className={shared.itemNote}>{item.text}</p>
          </li>
        ))}
      </ul>
      <button className={shared.button} onClick={() => setSoundText(brainrotSoundLabel)} style={{ marginTop: 10 }}>
        press for a sound effect
      </button>
      {soundText && <p className={shared.smallText} style={{ marginTop: 8 }}>{soundText}</p>}
    </Modal>
  )
}
