"use client"

import Modal from "@/components/shared/Modal"
import shared from "@/components/shared/panelContent.module.css"
import { wardrobeItems } from "@/lib/rooms"

export default function WardrobeModal({ onClose }) {
  return (
    <Modal title="Wardrobe" icon="👕" onClose={onClose}>
      <ul className={shared.list}>
        {wardrobeItems.map((item) => (
          <li key={item.id} className={shared.item}>
            <p className={shared.itemTitle}>{item.label}</p>
            {item.note && <p className={shared.itemNote}>{item.note}</p>}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
