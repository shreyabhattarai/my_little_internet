"use client"

import Modal from "@/components/shared/Modal"
import shared from "@/components/shared/panelContent.module.css"
import { bookshelfItems } from "@/lib/rooms"

export default function BookshelfModal({ onClose }) {
  return (
    <Modal title="Bookshelf" icon="📚" onClose={onClose}>
      {bookshelfItems.length === 0 ? (
        <div className={shared.emptyState}>
          <span className={shared.emptyStateIcon} aria-hidden="true">📚</span>
          <p>the shelf is bare for now</p>
        </div>
      ) : (
        <ul className={shared.list}>
          {bookshelfItems.map((item) => (
            <li key={item.id} className={shared.item}>
              <span className={shared.tag}>{item.type}</span>
              <p className={shared.itemTitle}>{item.title}</p>
              {item.note && <p className={shared.itemNote}>{item.note}</p>}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
