"use client"

import Modal from "./Modal"
import styles from "./panelContent.module.css"
import { feedEntries } from "@/lib/feed"
import { currentStatus } from "@/lib/mood"

export default function LifeFeed({ onClose }) {
  return (
    <Modal title="Desk, small updates" onClose={onClose}>
      <p className={styles.smallText}>currently thinking about {currentStatus.thought}</p>
      <ul className={styles.list}>
        {feedEntries.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <span className={styles.tag}>{entry.tag}</span>
            <p className={styles.itemNote}>
              {entry.date} {entry.text}
            </p>
          </li>
        ))}
      </ul>
    </Modal>
  )
}
