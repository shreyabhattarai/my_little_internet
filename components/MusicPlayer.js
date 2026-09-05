"use client"

import { useEffect, useRef, useState } from "react"
import Modal from "./Modal"
import styles from "./MusicPlayer.module.css"
import { playlists } from "@/lib/music"

export default function MusicPlayer({ onClose }) {
  const [activePlaylist, setActivePlaylist] = useState(playlists[0].id)
  const [playingTrackId, setPlayingTrackId] = useState(null)
  const [statusMessage, setStatusMessage] = useState("audio is off, tap a track to try it")
  const audioRef = useRef(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const currentPlaylist = playlists.find((p) => p.id === activePlaylist)

  function handlePlay(track) {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    if (playingTrackId === track.id) {
      setPlayingTrackId(null)
      setStatusMessage("paused")
      return
    }

    const audio = new Audio(track.src)
    audioRef.current = audio
    audio.play().catch(() => {
      setStatusMessage("no real audio file yet for " + track.title + ", drop one into public assets audio")
    })
    audio.addEventListener("ended", () => setPlayingTrackId(null))
    setPlayingTrackId(track.id)
    setStatusMessage("now playing " + track.title)
  }

  return (
    <Modal title="Music Corner" onClose={onClose}>
      <div className={styles.categoryRow}>
        {playlists.map((p) => (
          <button
            key={p.id}
            className={
              p.id === activePlaylist
                ? styles.categoryButton + " " + styles.categoryButtonActive
                : styles.categoryButton
            }
            onClick={() => setActivePlaylist(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className={styles.description}>{currentPlaylist.description}</p>

      {currentPlaylist.tracks.map((track) => (
        <div className={styles.track} key={track.id}>
          <div>
            <div className={styles.trackTitle}>{track.title}</div>
            <div className={styles.trackDuration}>{track.duration}</div>
          </div>
          <button
            className={
              playingTrackId === track.id
                ? styles.playButton + " " + styles.playButtonActive
                : styles.playButton
            }
            onClick={() => handlePlay(track)}
          >
            {playingTrackId === track.id ? "pause" : "play"}
          </button>
        </div>
      ))}

      <p className={styles.status}>{statusMessage}</p>
    </Modal>
  )
}
