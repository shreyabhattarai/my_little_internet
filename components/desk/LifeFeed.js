"use client"

import Modal from "@/components/shared/Modal"
import styles from "@/components/shared/panelContent.module.css"
import { feedEntries } from "@/lib/feed"
import { currentStatus } from "@/lib/mood"

export default function LifeFeed({ onClose }) {
  return (
    <Modal title="Desk, small updates" icon="🖊️" onClose={onClose}>
      <p className={styles.smallText}>currently thinking about {currentStatus.thought}</p>

      {feedEntries.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyStateIcon} aria-hidden="true">🖊️</span>
          <p>nothing written down yet</p>
        </div>
      ) : (
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
      )}
    </Modal>
  )
}
