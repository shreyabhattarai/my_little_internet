"use client"

import Modal from "../Modal"
import shared from "../panelContent.module.css"
import { bookshelfItems } from "@/lib/rooms"

export default function BookshelfModal({ onClose }) {
  return (
    <Modal title="Bookshelf" onClose={onClose}>
      <ul className={shared.list}>
        {bookshelfItems.map((item) => (
          <li key={item.id} className={shared.item}>
            <span className={shared.tag}>{item.type}</span>
            <p className={shared.itemTitle}>{item.title}</p>
            {item.note && <p className={shared.itemNote}>{item.note}</p>}
          </li>
        ))}
      </ul>
    </Modal>
  )
}
