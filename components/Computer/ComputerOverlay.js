"use client"

import { useEffect, useMemo, useState } from "react"
import styles from "./ComputerOverlay.module.css"
import { desktopApps, notesContent, internetLinks } from "@/lib/computer"
import { photos } from "@/lib/photos"
import { trashContents } from "@/lib/useless"

const folderOrder = ["photos", "music", "notes", "internet", "trash"]

const folderPositions = {
  photos: { row: 0, col: 0 },
  music: { row: 1, col: 0 },
  notes: { row: 2, col: 0 },
  internet: { row: 0, col: 1 },
  trash: { row: 1, col: 1 }
}

const internetMemeGallery = [
  { id: "m-1", src: "/images/memes/doge.png", label: "doge.png" },
  { id: "m-2", src: "/images/memes/drake.png", label: "drake.png" },
  { id: "m-3", src: "/images/memes/this-is-fine.png", label: "this-is-fine.png" },
  { id: "m-4", src: "/images/memes/surprised-pikachu.png", label: "surprised-pikachu.png" },
  { id: "m-5", src: "/images/memes/rick-astley.png", label: "rick-astley.png" },
  { id: "m-6", src: "/images/memes/gigachad.png", label: "gigachad.png" }
]

function FolderIcon() {
  return (
    <span className={styles.folderIcon} aria-hidden="true">
      <span className={styles.folderTab} />
      <span className={styles.folderBody} />
    </span>
  )
}

export default function ComputerOverlay({ onClose, reducedMotion }) {
  const [isBooted, setIsBooted] = useState(false)
  const [activeFolder, setActiveFolder] = useState("photos")
  const [isMinimized, setIsMinimized] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [trashItems, setTrashItems] = useState(trashContents)

  const desktopFolders = useMemo(() => {
    return folderOrder
      .map((id) => desktopApps.find((app) => app.id === id))
      .filter(Boolean)
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsBooted(true)
    }, reducedMotion ? 0 : 620)

    return () => clearTimeout(timeout)
  }, [reducedMotion])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  function deleteForever(id) {
    setTrashItems((prev) => prev.filter((item) => item.id !== id))
  }

  function handleFolderOpen(folderId) {
    setActiveFolder(folderId)
    setSelectedPhoto(null)
    setIsMinimized(false)
  }

  const currentFolder = desktopApps.find((app) => app.id === activeFolder)

  function renderExplorerContent() {
    if (activeFolder === "photos") {
      if (selectedPhoto) {
        return (
          <div className={styles.photoPreview}>
            <img src={selectedPhoto.src} alt={selectedPhoto.caption} className={styles.photoPreviewImage} />
            <p className={styles.metaLine}>
              <strong>Date:</strong> {selectedPhoto.date} | <strong>Location:</strong> {selectedPhoto.location}
            </p>
            <p className={styles.metaLine}>{selectedPhoto.caption}</p>
            {selectedPhoto.memory ? <p className={styles.metaLine}><em>Memory:</em> {selectedPhoto.memory}</p> : null}
            <button className={styles.xpAction} onClick={() => setSelectedPhoto(null)}>
              ← Back to all photos
            </button>
          </div>
        )
      }

      return (
        <div className={styles.photoGrid}>
          {photos.map((photo) => (
            <button key={photo.id} className={styles.photoThumb} onClick={() => setSelectedPhoto(photo)}>
              <img src={photo.src} alt={photo.caption} />
              <span>{photo.location}</span>
            </button>
          ))}
        </div>
      )
    }

    if (activeFolder === "music") {
      return (
        <div className={styles.folderTextPanel}>
          <p className={styles.metaLine}>
            Open the radio in the music corner of the room to actually hear anything, this icon is mostly decorative.
          </p>
          <div className={styles.musicPreviewGrid}>
            <img src="/images/shreya/me.jpg" alt="Album cover 1" />
            <img src="/images/shreya/pro.jpg" alt="Album cover 2" />
            <img src="/images/shreya/lake_back.jpg" alt="Album cover 3" />
          </div>
        </div>
      )
    }

    if (activeFolder === "notes") {
      return (
        <ul className={styles.noteList}>
          {notesContent.map((note) => (
            <li key={note.id}>
              <p className={styles.noteTitle}>{note.title}</p>
              <p className={styles.noteBody}>{note.body}</p>
            </li>
          ))}
        </ul>
      )
    }

    if (activeFolder === "internet") {
      return (
        <div>
          <p className={styles.metaLine}>Bookmarks and reaction images from old internet rabbit holes:</p>
          <ul className={styles.linksList}>
            {internetLinks.map((link) => (
              <li key={link.id}>
                <strong>{link.label}</strong>
                <span>{link.note}</span>
              </li>
            ))}
          </ul>
          <div className={styles.memeGrid}>
            {internetMemeGallery.map((meme) => (
              <figure key={meme.id}>
                <img src={meme.src} alt={meme.label} />
                <figcaption>{meme.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )
    }

    if (activeFolder === "trash") {
      return (
        <div>
          {trashItems.length === 0 ? (
            <p className={styles.metaLine}>The trash is empty, oddly satisfying.</p>
          ) : (
            <ul className={styles.trashList}>
              {trashItems.map((item) => (
                <li key={item.id}>
                  <span>{item.name}</span>
                  <button className={styles.xpDanger} onClick={() => deleteForever(item.id)}>
                    Delete Forever
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <section className={styles.frame} aria-label="Computer desktop overlay">
      <header className={styles.windowBar}>
        <div className={styles.windowTitleGroup}>
          <span className={styles.xpLogoIcon}>❖</span>
          <span className={styles.windowTitle}>Computer, fake desktop - Windows XP</span>
        </div>
        <div className={styles.windowControls}>
          <button type="button" aria-label="Minimize" title="Minimize">_</button>
          <button type="button" aria-label="Maximize" title="Maximize">□</button>
          <button type="button" className={styles.closeControl} aria-label="Close computer" onClick={onClose} title="Close">✕</button>
        </div>
      </header>

      <div className={styles.desktopShell}>
        <div className={isBooted ? styles.desktopReady : styles.desktopBooting}>
          <div className={styles.wallpaperGlow} />

          {!isBooted ? <p className={styles.bootText}>Waking up desktop...</p> : null}

          {desktopFolders.map((folder) => {
            const position = folderPositions[folder.id] || { row: 0, col: 0 }
            const isSelected = activeFolder === folder.id && !isMinimized
            return (
              <button
                key={folder.id}
                className={`${styles.desktopIcon} ${isSelected ? styles.desktopIconSelected : ""}`}
                style={{
                  "--icon-row": position.row,
                  "--icon-col": position.col
                }}
                onClick={() => handleFolderOpen(folder.id)}
                aria-label={`Open ${folder.label} folder`}
                disabled={!isBooted}
              >
                <FolderIcon />
                <span>{folder.label}</span>
              </button>
            )
          })}

          {isBooted && activeFolder && !isMinimized ? (
            <section className={styles.explorerWindow} role="dialog" aria-labelledby="explorer-title">
              <header className={styles.explorerBar}>
                <div className={styles.explorerTitleGroup}>
                  <FolderIcon />
                  <strong id="explorer-title">{currentFolder?.label || "Folder"}</strong>
                </div>
                <button
                  className={styles.explorerClose}
                  onClick={() => setActiveFolder("")}
                  aria-label="Close folder window"
                  title="Close window"
                >
                  ✕
                </button>
              </header>
              <div className={styles.explorerToolbar}>
                <span><u>F</u>ile</span>
                <span><u>E</u>dit</span>
                <span><u>V</u>iew</span>
                <span><u>F</u>avorites</span>
                <span><u>T</u>ools</span>
              </div>
              <div className={styles.explorerAddressBar}>
                <span className={styles.addressLabel}>Address</span>
                <div className={styles.addressInput}>
                  C:\Documents and Settings\Desktop\{currentFolder?.label || activeFolder}
                </div>
              </div>
              <div className={styles.explorerBody}>{renderExplorerContent()}</div>
            </section>
          ) : null}
        </div>
      </div>

      <footer className={styles.taskbar}>
        <button className={styles.startButton}>
          <span className={styles.startFlag}>❖</span> start
        </button>
        <div className={styles.taskbarItems}>
          {activeFolder ? (
            <button
              className={`${styles.taskbarButton} ${!isMinimized ? styles.taskbarButtonActive : ""}`}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <FolderIcon />
              <span className={styles.taskLabel}>{currentFolder?.label || activeFolder}</span>
            </button>
          ) : null}
        </div>
        <div className={styles.systemTray}>
          <span className={styles.clock}>11:42 PM</span>
        </div>
      </footer>
    </section>
  )
}