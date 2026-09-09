"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import styles from "./ComputerOverlay.module.css"
import { desktopApps, notesContent, internetLinks } from "@/lib/computer"
import { photos } from "@/lib/photos"
import { trashContents } from "@/lib/useless"
import {
  IconWindowsFlag,
  IconFolder,
  IconPicturesFolder,
  IconNotepad,
  IconInternet,
  IconRecycleBin,
  IconChevron,
  IconPlay,
  IconPause
} from "./icons"

const folderOrder = ["photos", "notes", "internet", "trash"]

const folderPositions = {
  photos: { row: 0, col: 0 },
  notes: { row: 1, col: 0 },
  internet: { row: 0, col: 1 },
  trash: { row: 1, col: 1 }
}

const EXPLORER_CLOSE_MS = 190
const SLIDESHOW_INTERVAL_MS = 2600
const SHUTDOWN_MS = 1500
const RESTART_MS = 1700
const STANDBY_FLASH_MS = 260

function formatClock(date) {
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const suffix = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  if (hours === 0) hours = 12
  return `${hours}:${minutes} ${suffix}`
}

function formatTrayDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

function FolderIconFor({ id, isTrashEmpty }) {
  if (id === "photos") return <IconPicturesFolder />
  if (id === "trash") return <IconRecycleBin isFull={!isTrashEmpty} />
  if (id === "internet") return <IconInternet size={26} />
  if (id === "notes") return <IconNotepad size={26} />
  return <IconFolder />
}

export default function ComputerOverlay({ onClose, reducedMotion }) {
  const [bootProgress, setBootProgress] = useState(0)
  const [isBooted, setIsBooted] = useState(false)
  const [bootCycle, setBootCycle] = useState(0)
  const [activeFolder, setActiveFolder] = useState("")
  const [explorerClosing, setExplorerClosing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isFrameMaximized, setIsFrameMaximized] = useState(false)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false)
  const [trashItems, setTrashItems] = useState(trashContents)
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false)
  const [shutdownStage, setShutdownStage] = useState(null)
  const [isStandbyFlashing, setIsStandbyFlashing] = useState(false)
  const [now, setNow] = useState(() => new Date())

  const explorerTimeoutRef = useRef(null)
  const powerTimeoutRef = useRef(null)
  const standbyTimeoutRef = useRef(null)
  const startMenuRef = useRef(null)
  const startButtonRef = useRef(null)

  const desktopFolders = useMemo(() => {
    return folderOrder.map((id) => desktopApps.find((app) => app.id === id)).filter(Boolean)
  }, [])

  const currentFolder = desktopApps.find((app) => app.id === activeFolder)
  const currentPhoto = selectedPhotoIndex !== null ? photos[selectedPhotoIndex] : null

  // boot sequence, a real progress bar instead of a static line of text
  useEffect(() => {
    if (reducedMotion) {
      setBootProgress(100)
      setIsBooted(true)
      return
    }

    let raf = null
    let value = 0

    function tick() {
      value += 4 + Math.random() * 9
      if (value >= 100) {
        setBootProgress(100)
        setIsBooted(true)
        return
      }
      setBootProgress(value)
      raf = window.setTimeout(tick, 90)
    }

    raf = window.setTimeout(tick, 240)
    return () => window.clearTimeout(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, bootCycle])

  // real clock, ticks every second
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    return () => {
      if (explorerTimeoutRef.current) window.clearTimeout(explorerTimeoutRef.current)
      if (powerTimeoutRef.current) window.clearTimeout(powerTimeoutRef.current)
      if (standbyTimeoutRef.current) window.clearTimeout(standbyTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (!isStartMenuOpen) return

    function handlePointerDown(event) {
      if (startMenuRef.current?.contains(event.target)) return
      if (startButtonRef.current?.contains(event.target)) return
      setIsStartMenuOpen(false)
    }

    window.addEventListener("pointerdown", handlePointerDown)
    return () => window.removeEventListener("pointerdown", handlePointerDown)
  }, [isStartMenuOpen])

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key !== "Escape") return

      if (shutdownStage === "confirm") {
        setShutdownStage(null)
        return
      }
      if (isStartMenuOpen) {
        setIsStartMenuOpen(false)
        return
      }
      if (activeFolder && !isMinimized) {
        closeFolder()
        return
      }
      onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFolder, isMinimized, isStartMenuOpen, shutdownStage, onClose, reducedMotion])

  // slideshow autoplay, only while photos folder is open and visible
  useEffect(() => {
    if (!isSlideshowPlaying || activeFolder !== "photos" || isMinimized || reducedMotion) return
    if (photos.length < 2) return

    const id = window.setInterval(() => {
      setSelectedPhotoIndex((prev) => {
        const base = prev === null ? 0 : prev
        return (base + 1) % photos.length
      })
    }, SLIDESHOW_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [isSlideshowPlaying, activeFolder, isMinimized, reducedMotion])

  function openFolder(id) {
    if (explorerTimeoutRef.current) {
      window.clearTimeout(explorerTimeoutRef.current)
      explorerTimeoutRef.current = null
    }
    setExplorerClosing(false)
    setActiveFolder(id)
    setIsMinimized(false)
    setIsStartMenuOpen(false)
    setSelectedPhotoIndex(null)
    setIsSlideshowPlaying(false)
  }

  function closeFolder() {
    if (reducedMotion) {
      setActiveFolder("")
      setIsSlideshowPlaying(false)
      return
    }

    setExplorerClosing(true)
    explorerTimeoutRef.current = window.setTimeout(() => {
      setActiveFolder("")
      setExplorerClosing(false)
      setIsSlideshowPlaying(false)
    }, EXPLORER_CLOSE_MS)
  }

  function handleTaskbarClick() {
    setIsMinimized((prev) => !prev)
  }

  function deleteForever(id) {
    setTrashItems((prev) => prev.filter((item) => item.id !== id))
  }

  function goToPhoto(index) {
    const total = photos.length
    setSelectedPhotoIndex(((index % total) + total) % total)
  }

  function toggleSlideshow() {
    setIsSlideshowPlaying((prev) => {
      const next = !prev
      if (next && selectedPhotoIndex === null) setSelectedPhotoIndex(0)
      return next
    })
  }

  function handleStandBy() {
    setIsStartMenuOpen(false)
    setShutdownStage(null)
    setIsStandbyFlashing(true)
    standbyTimeoutRef.current = window.setTimeout(
      () => setIsStandbyFlashing(false),
      reducedMotion ? 0 : STANDBY_FLASH_MS
    )
  }

  function handleTurnOff() {
    setShutdownStage("shutting-down")
    powerTimeoutRef.current = window.setTimeout(onClose, reducedMotion ? 0 : SHUTDOWN_MS)
  }

  function handleRestart() {
    setShutdownStage("restarting")
    powerTimeoutRef.current = window.setTimeout(() => {
      setActiveFolder("")
      setIsMinimized(false)
      setIsFrameMaximized(false)
      setSelectedPhotoIndex(null)
      setIsSlideshowPlaying(false)
      setIsBooted(false)
      setBootProgress(0)
      setBootCycle((prev) => prev + 1)
      setShutdownStage(null)
    }, reducedMotion ? 0 : RESTART_MS)
  }

  function renderTaskPane() {
    const label = currentFolder?.label || "Folder"
    const count =
      activeFolder === "photos"
        ? photos.length
        : activeFolder === "notes"
          ? notesContent.length
          : activeFolder === "internet"
            ? internetLinks.length
            : trashItems.length

    return (
      <aside className={styles.taskPane}>
        <div className={styles.taskPaneIcon}>
          <FolderIconFor id={activeFolder} isTrashEmpty={trashItems.length === 0} />
        </div>
        <p className={styles.taskPaneTitle}>{label}</p>
        <p className={styles.taskPaneMeta}>
          {activeFolder === "photos" ? "Picture folder" : "File folder"}
        </p>
        <p className={styles.taskPaneMeta}>
          {count} {count === 1 ? "object" : "objects"}
        </p>

        {activeFolder === "photos" && photos.length > 1 ? (
          <button
            type="button"
            className={styles.taskPaneAction}
            onClick={toggleSlideshow}
            disabled={reducedMotion}
            title={reducedMotion ? "Slideshow disabled by your motion setting" : "Play through every photo"}
          >
            {isSlideshowPlaying ? <IconPause size={12} /> : <IconPlay size={12} />}
            {isSlideshowPlaying ? "Stop slideshow" : "View as slideshow"}
          </button>
        ) : null}

        {currentPhoto ? (
          <div className={styles.taskPaneDetails}>
            <p className={styles.taskPaneMeta}>
              <strong>Date</strong> {currentPhoto.date}
            </p>
            <p className={styles.taskPaneMeta}>
              <strong>Place</strong> {currentPhoto.location}
            </p>
          </div>
        ) : null}
      </aside>
    )
  }

  function renderExplorerContent() {
    if (activeFolder === "photos") {
      if (photos.length === 0) {
        return (
          <div className={styles.emptyFolder}>
            <span aria-hidden="true">🖼️</span>
            <p>no photos yet</p>
          </div>
        )
      }

      if (currentPhoto) {
        return (
          <div className={styles.filmstrip}>
            <div className={styles.filmstripStage}>
              <button
                type="button"
                className={styles.filmstripArrow}
                onClick={() => goToPhoto(selectedPhotoIndex - 1)}
                aria-label="Previous photo"
              >
                <IconChevron direction="left" />
              </button>

              <div className={styles.filmstripFrame}>
                <img
                  key={currentPhoto.id}
                  src={currentPhoto.src}
                  alt={currentPhoto.caption}
                  className={styles.filmstripImage}
                />
              </div>

              <button
                type="button"
                className={styles.filmstripArrow}
                onClick={() => goToPhoto(selectedPhotoIndex + 1)}
                aria-label="Next photo"
              >
                <IconChevron direction="right" />
              </button>
            </div>

            <p className={styles.filmstripCaption}>{currentPhoto.caption}</p>
            {currentPhoto.memory ? (
              <p className={styles.filmstripMemory}>{currentPhoto.memory}</p>
            ) : null}

            <div className={styles.filmstripTray}>
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  className={`${styles.filmstripThumb} ${
                    index === selectedPhotoIndex ? styles.filmstripThumbActive : ""
                  }`}
                  onClick={() => goToPhoto(index)}
                  aria-label={`Show photo ${index + 1}`}
                  aria-current={index === selectedPhotoIndex}
                >
                  <img src={photo.src} alt="" />
                </button>
              ))}
            </div>

            <button className={styles.xpAction} onClick={() => setSelectedPhotoIndex(null)}>
              <IconChevron direction="left" size={12} /> Back to all photos
            </button>
          </div>
        )
      }

      return (
        <div className={styles.photoGrid}>
          {photos.map((photo, index) => (
            <button key={photo.id} className={styles.photoThumb} onClick={() => goToPhoto(index)}>
              <span className={styles.photoThumbFrame}>
                <img src={photo.src} alt={photo.caption} />
              </span>
              <span className={styles.photoThumbLabel}>{photo.location}</span>
            </button>
          ))}
        </div>
      )
    }

    if (activeFolder === "notes") {
      if (notesContent.length === 0) {
        return (
          <div className={styles.emptyFolder}>
            <span aria-hidden="true">📝</span>
            <p>no notes yet</p>
          </div>
        )
      }

      return (
        <ul className={styles.noteList}>
          {notesContent.map((note) => (
            <li key={note.id}>
              <div className={styles.noteIcon}>
                <IconNotepad size={20} />
              </div>
              <div>
                <p className={styles.noteTitle}>{note.title}</p>
                <p className={styles.noteBody}>{note.body}</p>
              </div>
            </li>
          ))}
        </ul>
      )
    }

    if (activeFolder === "internet") {
      if (internetLinks.length === 0) {
        return (
          <div className={styles.emptyFolder}>
            <span aria-hidden="true">🔗</span>
            <p>no bookmarks yet</p>
          </div>
        )
      }

      return (
        <div>
          <p className={styles.metaLine}>Bookmarks from old internet rabbit holes:</p>
          <ul className={styles.linksList}>
            {internetLinks.map((link) => (
              <li key={link.id}>
                <div className={styles.linkIcon}>
                  <IconInternet size={18} />
                </div>
                <div>
                  <strong>{link.label}</strong>
                  <span>{link.note}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )
    }

    if (activeFolder === "trash") {
      return (
        <div>
          {trashItems.length === 0 ? (
            <div className={styles.emptyFolder}>
              <span aria-hidden="true">🗑️</span>
              <p>the trash is empty, oddly satisfying</p>
            </div>
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
    <section
      className={`${styles.frame} ${isFrameMaximized ? styles.frameMaximized : ""}`}
      aria-label="Computer desktop overlay"
    >
      <header className={styles.windowBar}>
        <div className={styles.windowTitleGroup}>
          <IconWindowsFlag />
          <span className={styles.windowTitle}>Computer, fake desktop - Windows XP</span>
        </div>
        <div className={styles.windowControls}>
          <button type="button" className={styles.decorativeControl} aria-label="Minimize" title="Minimize">
            _
          </button>
          <button
            type="button"
            aria-label={isFrameMaximized ? "Restore down" : "Maximize"}
            title={isFrameMaximized ? "Restore down" : "Maximize"}
            onClick={() => setIsFrameMaximized((prev) => !prev)}
          >
            {isFrameMaximized ? "❐" : "□"}
          </button>
          <button
            type="button"
            className={styles.closeControl}
            aria-label="Close computer"
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </header>

      <div className={styles.desktopShell}>
        <div className={isBooted ? styles.desktopReady : styles.desktopBooting}>
          <div className={styles.wallpaper}>
            <div className={styles.wallpaperSun} />
            <div className={styles.wallpaperHillFar} />
            <div className={styles.wallpaperHillNear} />
          </div>

          {!isBooted ? (
            <div className={styles.bootScreen}>
              <IconWindowsFlag size={30} />
              <p className={styles.bootTitle}>Starting up</p>
              <div className={styles.bootBarTrack}>
                <div className={styles.bootBarFill} style={{ width: `${bootProgress}%` }} />
              </div>
            </div>
          ) : null}

          {isBooted &&
            desktopFolders.map((folder) => {
              const position = folderPositions[folder.id] || { row: 0, col: 0 }
              const isSelected = activeFolder === folder.id && !isMinimized
              return (
                <button
                  key={folder.id}
                  className={`${styles.desktopIcon} ${isSelected ? styles.desktopIconSelected : ""}`}
                  style={{ "--icon-row": position.row, "--icon-col": position.col }}
                  onClick={() => openFolder(folder.id)}
                  onDoubleClick={() => openFolder(folder.id)}
                  aria-label={`Open ${folder.label} folder`}
                >
                  <FolderIconFor id={folder.id} isTrashEmpty={trashItems.length === 0} />
                  <span>{folder.label}</span>
                </button>
              )
            })}

          {isBooted && activeFolder && !isMinimized ? (
            <section
              key={activeFolder}
              className={`${styles.explorerWindow} ${explorerClosing ? styles.explorerClosing : styles.explorerOpening}`}
              role="dialog"
              aria-labelledby="explorer-title"
            >
              <header className={styles.explorerBar}>
                <div className={styles.explorerTitleGroup}>
                  <FolderIconFor id={activeFolder} isTrashEmpty={trashItems.length === 0} />
                  <strong id="explorer-title">{currentFolder?.label || "Folder"}</strong>
                </div>
                <div className={styles.explorerControls}>
                  <button
                    className={styles.explorerMinimize}
                    onClick={() => setIsMinimized(true)}
                    aria-label="Minimize folder window"
                    title="Minimize"
                  >
                    _
                  </button>
                  <button
                    className={styles.explorerClose}
                    onClick={closeFolder}
                    aria-label="Close folder window"
                    title="Close window"
                  >
                    ✕
                  </button>
                </div>
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
              <div className={styles.explorerLayout}>
                {renderTaskPane()}
                <div className={styles.explorerBody}>{renderExplorerContent()}</div>
              </div>
            </section>
          ) : null}

          {isStartMenuOpen ? (
            <div ref={startMenuRef} className={styles.startMenu}>
              <div className={styles.startMenuHeader}>
                <div className={styles.startMenuAvatar} aria-hidden="true">
                  🙂
                </div>
                <span>Guest</span>
              </div>
              <div className={styles.startMenuBody}>
                <div className={styles.startMenuColumnMain}>
                  {desktopFolders.map((folder) => (
                    <button key={folder.id} onClick={() => openFolder(folder.id)}>
                      <FolderIconFor id={folder.id} isTrashEmpty={trashItems.length === 0} />
                      {folder.label}
                    </button>
                  ))}
                </div>
                <div className={styles.startMenuColumnSide}>
                  <span>My Computer</span>
                  <span>Control Panel</span>
                  <span>Printers and Faxes</span>
                  <span>Help and Support</span>
                </div>
              </div>
              <div className={styles.startMenuFooter}>
                <button type="button" className={styles.startMenuLogOff} disabled title="Not available on a fake desktop">
                  Log Off
                </button>
                <button
                  type="button"
                  className={styles.startMenuTurnOff}
                  onClick={() => setShutdownStage("confirm")}
                >
                  Turn Off Computer
                </button>
              </div>
            </div>
          ) : null}

          {shutdownStage === "confirm" ? (
            <div className={styles.shutdownBackdrop}>
              <div className={styles.shutdownDialog} role="dialog" aria-label="Turn off computer">
                <p className={styles.shutdownTitle}>Turn off computer</p>
                <div className={styles.shutdownOptions}>
                  <button onClick={handleStandBy}>
                    <span className={styles.shutdownIconStandby} aria-hidden="true" />
                    Stand By
                  </button>
                  <button onClick={handleTurnOff}>
                    <span className={styles.shutdownIconOff} aria-hidden="true" />
                    Turn Off
                  </button>
                  <button onClick={handleRestart}>
                    <span className={styles.shutdownIconRestart} aria-hidden="true" />
                    Restart
                  </button>
                </div>
                <button className={styles.shutdownCancel} onClick={() => setShutdownStage(null)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}

          {shutdownStage === "shutting-down" || shutdownStage === "restarting" ? (
            <div className={styles.powerScreen}>
              <p>{shutdownStage === "shutting-down" ? "Windows is shutting down..." : "Windows is restarting..."}</p>
            </div>
          ) : null}

          {isStandbyFlashing ? <div className={styles.standbyFlash} /> : null}
        </div>
      </div>

      <footer className={styles.taskbar}>
        <button
          ref={startButtonRef}
          className={`${styles.startButton} ${isStartMenuOpen ? styles.startButtonActive : ""}`}
          onClick={() => setIsStartMenuOpen((prev) => !prev)}
        >
          <IconWindowsFlag size={15} /> start
        </button>
        <div className={styles.taskbarItems}>
          {activeFolder ? (
            <button
              className={`${styles.taskbarButton} ${!isMinimized ? styles.taskbarButtonActive : ""}`}
              onClick={handleTaskbarClick}
            >
              <FolderIconFor id={activeFolder} isTrashEmpty={trashItems.length === 0} />
              <span className={styles.taskLabel}>{currentFolder?.label || activeFolder}</span>
            </button>
          ) : null}
        </div>
        <div className={styles.systemTray} title={formatTrayDate(now)}>
          <span className={styles.clock}>{formatClock(now)}</span>
        </div>
      </footer>
    </section>
  )
}
