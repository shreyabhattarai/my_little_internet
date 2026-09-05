"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./SpeakerOverlay.module.css"
import { playlists as fallbackPlaylists } from "@/lib/music"

const persistentPlayer = {
  audio: null,
  trackId: null,
  status: "ready"
}

function IconPrev() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="2" height="14" rx="1" />
      <path d="M18 6L8 12L18 18V6Z" />
    </svg>
  )
}

function IconPlay() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 6L19 12L8 18V6Z" />
    </svg>
  )
}

function IconPause() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="6" width="3.5" height="12" rx="1" />
      <rect x="13.5" y="6" width="3.5" height="12" rx="1" />
    </svg>
  )
}

function IconNext() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="18" y="5" width="2" height="14" rx="1" />
      <path d="M6 6L16 12L6 18V6Z" />
    </svg>
  )
}

function IconStop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="7" width="10" height="10" rx="1" />
    </svg>
  )
}

function IconShuffle() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 7H21V2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 2L13 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5L10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H21V22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 22L13 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 19L10 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function formatTime(totalSeconds) {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0
  const minutes = Math.floor(safe / 60)
  const seconds = String(safe % 60).padStart(2, "0")
  return `${String(minutes).padStart(2, "0")}:${seconds}`
}

export default function SpeakerOverlay({ onClose }) {
  const mountedRef = useRef(false)
  const [playlists, setPlaylists] = useState(fallbackPlaylists)
  const [allTracks, setAllTracks] = useState([])
  const [activePlaylistId, setActivePlaylistId] = useState(fallbackPlaylists[0].id)
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)
  const [playingTrackId, setPlayingTrackId] = useState(persistentPlayer.trackId)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [statusMessage, setStatusMessage] = useState(persistentPlayer.status)

  const currentPlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0]
  const currentTracks = currentPlaylist?.tracks || []
  const currentTrack = currentTracks[activeTrackIndex] || currentTracks[0]
  const isPlayingCurrent = currentTrack && playingTrackId === currentTrack.id

  function syncToPersistentTrack(sourcePlaylists) {
    if (!persistentPlayer.trackId) return

    const playlist = sourcePlaylists.find((p) =>
      p.tracks.some((track) => track.id === persistentPlayer.trackId)
    )
    if (!playlist) return

    const trackIndex = playlist.tracks.findIndex((track) => track.id === persistentPlayer.trackId)
    setActivePlaylistId(playlist.id)
    setActiveTrackIndex(Math.max(0, trackIndex))
  }

  useEffect(() => {
    mountedRef.current = true

    if (persistentPlayer.audio && !persistentPlayer.audio.paused) {
      setElapsedSeconds(persistentPlayer.audio.currentTime || 0)
      setStatusMessage("playing")
    }

    let cancelled = false

    async function loadLibrary() {
      try {
        const response = await fetch("/api/audio")
        const data = await response.json()
        if (cancelled) return

        if (Array.isArray(data.playlists) && data.playlists.length > 0) {
          setPlaylists(data.playlists)
          setAllTracks(Array.isArray(data.allTracks) ? data.allTracks : [])
          if (persistentPlayer.trackId) {
            syncToPersistentTrack(data.playlists)
          } else {
            setActivePlaylistId(data.playlists[0].id)
          }
          if (persistentPlayer.status === "ready") {
            setStatusMessage("library loaded")
          }
          return
        }

        const fallbackAllTracks = fallbackPlaylists.flatMap((playlist) => playlist.tracks)
        setPlaylists(fallbackPlaylists)
        setAllTracks(fallbackAllTracks)
        if (persistentPlayer.trackId) {
          syncToPersistentTrack(fallbackPlaylists)
        } else {
          setActivePlaylistId(fallbackPlaylists[0].id)
        }
        if (persistentPlayer.status === "ready") {
          setStatusMessage("using fallback list")
        }
      } catch {
        if (cancelled) return
        const fallbackAllTracks = fallbackPlaylists.flatMap((playlist) => playlist.tracks)
        setPlaylists(fallbackPlaylists)
        setAllTracks(fallbackAllTracks)
        if (persistentPlayer.trackId) {
          syncToPersistentTrack(fallbackPlaylists)
        } else {
          setActivePlaylistId(fallbackPlaylists[0].id)
        }
        if (persistentPlayer.status === "ready") {
          setStatusMessage("using fallback list")
        }
      }
    }

    loadLibrary()

    return () => {
      mountedRef.current = false
      cancelled = true
    }
  }, [])

  function stopPlayback() {
    if (persistentPlayer.audio) {
      persistentPlayer.audio.pause()
      persistentPlayer.audio = null
    }
    persistentPlayer.trackId = null
    persistentPlayer.status = "stopped"
    setPlayingTrackId(null)
  }

  function playTrack(track) {
    stopPlayback()

    const audio = new Audio(track.src)
    persistentPlayer.audio = audio
    persistentPlayer.trackId = track.id
    audio.currentTime = 0
    audio.ontimeupdate = () => {
      if (mountedRef.current) {
        setElapsedSeconds(audio.currentTime)
      }
    }
    audio.onended = () => {
      persistentPlayer.trackId = null
      persistentPlayer.status = "done"
      if (mountedRef.current) {
        setPlayingTrackId(null)
        setElapsedSeconds(0)
        setStatusMessage("done")
      }
    }

    audio.play().then(() => {
      persistentPlayer.status = "playing"
      setPlayingTrackId(track.id)
      setStatusMessage("playing")
    }).catch(() => {
      persistentPlayer.trackId = null
      persistentPlayer.status = "missing audio file"
      setStatusMessage("missing audio file")
    })
  }

  function selectTrack(index) {
    setActiveTrackIndex(index)
    setElapsedSeconds(0)
  }

  function handlePlayPause() {
    if (!currentTrack) return

    if (isPlayingCurrent && persistentPlayer.audio) {
      persistentPlayer.audio.pause()
      persistentPlayer.status = "paused"
      setPlayingTrackId(null)
      setStatusMessage("paused")
      return
    }

    playTrack(currentTrack)
  }

  function handleShuffle() {
    if (!allTracks.length) {
      setStatusMessage("no tracks found in public/audio")
      return
    }

    const pick = allTracks[Math.floor(Math.random() * allTracks.length)]
    const playlistIndex = playlists.findIndex((playlist) =>
      playlist.tracks.some((track) => track.id === pick.id)
    )

    if (playlistIndex >= 0) {
      const selectedPlaylist = playlists[playlistIndex]
      const selectedTrackIndex = selectedPlaylist.tracks.findIndex((track) => track.id === pick.id)
      setActivePlaylistId(selectedPlaylist.id)
      setActiveTrackIndex(Math.max(0, selectedTrackIndex))
      setElapsedSeconds(0)
      setStatusMessage("shuffle")
      playTrack(pick)
      return
    }

    // Fallback path in case track grouping changed.
    setStatusMessage("shuffle")
    playTrack(pick)
  }

  function handlePrev() {
    if (!currentTracks.length) return
    const nextIndex = (activeTrackIndex - 1 + currentTracks.length) % currentTracks.length
    selectTrack(nextIndex)
  }

  function handleNext() {
    if (!currentTracks.length) return
    const nextIndex = (activeTrackIndex + 1) % currentTracks.length
    selectTrack(nextIndex)
  }

  useEffect(() => {
    if (!currentTracks.length) {
      setActiveTrackIndex(0)
      return
    }

    if (activeTrackIndex >= currentTracks.length) {
      setActiveTrackIndex(0)
    }
  }, [activeTrackIndex, currentTracks.length])

  return (
    <section className={styles.panel} aria-label="Speaker player">
      <header className={styles.chromeBar}>
        <span className={styles.brand}>Desk Speaker Classic</span>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close speaker overlay">
          x
        </button>
      </header>

      <div className={styles.displayArea}>
        <div className={styles.timeBlock}>
          <span className={styles.timeValue}>{formatTime(elapsedSeconds)}</span>
          <div className={styles.equalizer}>
            {new Array(9).fill(0).map((_, i) => (
              <span
                key={i}
                className={
                  isPlayingCurrent ? styles.eqBar + " " + styles.eqBarAnimated : styles.eqBar
                }
                style={{ animationDelay: `${i * 85}ms` }}
              />
            ))}
          </div>
        </div>

        <div className={styles.metaBlock}>
          <p className={styles.trackLine}>{currentTrack ? currentTrack.title : "No Track"}</p>
          <p className={styles.subLine}>{currentPlaylist.label} tape</p>
          <div className={styles.metaChips}>
            <span>128 kbps</span>
            <span>40 kHz</span>
            <span>{currentTrack ? currentTrack.duration : "0:00"}</span>
          </div>
        </div>
      </div>

      <div className={styles.playlistRow}>
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            className={
              playlist.id === activePlaylistId
                ? styles.tapeButton + " " + styles.tapeButtonActive
                : styles.tapeButton
            }
            onClick={() => setActivePlaylistId(playlist.id)}
          >
            {playlist.label}
          </button>
        ))}
      </div>

      <div className={styles.trackStrip}>
        {currentTracks.map((track, index) => (
          <button
            key={track.id}
            className={index === activeTrackIndex ? styles.trackTab + " " + styles.trackTabActive : styles.trackTab}
            onClick={() => selectTrack(index)}
          >
            {index + 1}. {track.title}
          </button>
        ))}
      </div>

      <div className={styles.transportRow}>
        <button className={styles.controlButton} onClick={handlePrev} aria-label="Previous track">
          <IconPrev />
        </button>
        <button className={styles.controlButton} onClick={handlePlayPause} aria-label="Play or pause">
          {isPlayingCurrent ? <IconPause /> : <IconPlay />}
        </button>
        <button className={styles.controlButton} onClick={handleNext} aria-label="Next track">
          <IconNext />
        </button>
        <button
          className={styles.controlButton}
          onClick={() => {
            stopPlayback()
            setElapsedSeconds(0)
            setStatusMessage("stopped")
          }}
          aria-label="Stop"
        >
          <IconStop />
        </button>
        <button
          className={styles.controlButton}
          onClick={handleShuffle}
          aria-label="Shuffle from all audio folders"
          title="Shuffle from all audio folders"
        >
          <IconShuffle />
        </button>
      </div>

      <footer className={styles.footerLine}>
        <span>{statusMessage}</span>
        <span>{currentPlaylist.description}</span>
      </footer>
    </section>
  )
}
