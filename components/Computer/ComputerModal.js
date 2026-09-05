"use client"

import { useState } from "react"
import Modal from "../Modal"
import styles from "./ComputerModal.module.css"
import shared from "../panelContent.module.css"
import { desktopApps, notesContent, internetLinks } from "@/lib/computer"
import { photos } from "@/lib/photos"
import { trashContents } from "@/lib/useless"

export default function ComputerModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("photos")
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [trashItems, setTrashItems] = useState(trashContents)

  function deleteForever(id) {
    setTrashItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Modal title="My Computer" onClose={onClose}>
      <div className={styles.tabRow}>
        {desktopApps.map((app) => (
          <button
            key={app.id}
            className={
              app.id === activeTab
                ? styles.tabButton + " " + styles.tabButtonActive
                : styles.tabButton
            }
            onClick={() => {
              setActiveTab(app.id)
              setSelectedPhoto(null)
            }}
          >
            {app.label}
          </button>
        ))}
      </div>

      {activeTab === "photos" && (
        <div>
          {selectedPhoto ? (
            <div>
              <img
                src={selectedPhoto.src}
                alt={selectedPhoto.caption}
                style={{ width: "100%", borderRadius: 6, marginBottom: 10 }}
              />
              <p className={shared.smallText}>
                {selectedPhoto.date}, found near the {selectedPhoto.location}
              </p>
              <p className={shared.smallText}>
                {selectedPhoto.caption}
              </p>
              {selectedPhoto.memory && (
                <p className={shared.smallText}>memory, {selectedPhoto.memory}</p>
              )}
              <button className={shared.button} onClick={() => setSelectedPhoto(null)}>
                back to all photos
              </button>
            </div>
          ) : (
            <div className={shared.photoGrid}>
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  className={shared.photoThumb}
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img src={photo.src} alt={photo.caption} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "music" && (
        <p className={shared.smallText}>
          open the radio in the music corner of the room to actually hear anything, this icon is mostly decorative
        </p>
      )}

      {activeTab === "notes" && (
        <ul className={shared.list}>
          {notesContent.map((note) => (
            <li key={note.id} className={shared.item}>
              <p className={shared.itemTitle}>{note.title}</p>
              <p className={shared.itemNote}>{note.body}</p>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "internet" && (
        <ul className={shared.list}>
          {internetLinks.map((link) => (
            <li key={link.id} className={shared.item}>
              <p className={shared.itemTitle}>{link.label}</p>
              <p className={shared.itemNote}>{link.note}</p>
            </li>
          ))}
        </ul>
      )}

      {activeTab === "trash" && (
        <div>
          {trashItems.length === 0 ? (
            <p className={styles.emptyState}>the trash is empty, oddly satisfying</p>
          ) : (
            trashItems.map((item) => (
              <div key={item.id} className={styles.trashRow}>
                <span>{item.name}</span>
                <button className={styles.trashButton} onClick={() => deleteForever(item.id)}>
                  delete forever
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  )
}
