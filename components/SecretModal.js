"use client"

import Modal from "./Modal"
import shared from "./panelContent.module.css"

export default function SecretModal({ secret, onClose }) {
  return (
    <Modal title={secret.title} onClose={onClose}>
      <p className={shared.smallText}>{secret.message}</p>
      {secret.reward && <p className={shared.itemNote} style={{ marginTop: 10 }}>reward, {secret.reward}</p>}
      {secret.contents && (
        <ul className={shared.list} style={{ marginTop: 10 }}>
          {secret.contents.map((line, i) => (
            <li key={i} className={shared.item}>
              <p className={shared.itemNote}>{line}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  )
}
