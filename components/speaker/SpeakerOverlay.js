"use client"

import { useEffect, useRef, useState } from "react"
import styles from "./SpeakerOverlay.module.css"
import { getDefaultPlaylistId, pickRandomTrackFromPlaylist } from "@/lib/music"
import { persistentSpeakerPlayer } from "@/lib/speakerPlayer"

const persistentPlayer = persistentSpeakerPlayer

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

function IconLoop() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17 2L21 6L17 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 6H9C6.8 6 5 7.8 5 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 22L3 18L7 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 18H15C17.2 18 19 16.2 19 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconNote() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M9 18V5l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM20 15a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function formatTime(seconds) {
  const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0
  const minutes = Math.floor(safe / 60)
  const remaining = String(safe % 60).padStart(2, "0")
  return `${String(minutes).padStart(2, "0")}:${remaining}`
}

function parseDuration(value) {
  if (!value || typeof value !== "string") return 0

  const parts = value.split(":").map(Number)
  if (parts.some(Number.isNaN)) return 0

  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]

  return 0
}

export default function SpeakerOverlay({ onClose }) {
  const mountedRef = useRef(false)

  const [loadStatus, setLoadStatus] = useState("loading")
  const [playlists, setPlaylists] = useState([])
  const [allTracks, setAllTracks] = useState([])
  const [activePlaylistId, setActivePlaylistId] = useState("")
  const [activeTrackIndex, setActiveTrackIndex] = useState(0)
  const [playingTrackId, setPlayingTrackId] = useState(persistentPlayer.trackId)
  const [elapsedSeconds, setElapsedSeconds] = useState(persistentPlayer.audio?.currentTime || 0)
  const [durationSeconds, setDurationSeconds] = useState(persistentPlayer.audio?.duration || 0)
  const [isLoopEnabled, setIsLoopEnabled] = useState(Boolean(persistentPlayer.audio?.loop))

  const currentPlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0]
  const currentTracks = currentPlaylist?.tracks || []
  const currentTrack = currentTracks[activeTrackIndex] || currentTracks[0]

  const metadataDuration = parseDuration(currentTrack?.duration)
  const trackDuration = durationSeconds > 0 ? durationSeconds : metadataDuration

  const isPlaying =
    Boolean(currentTrack) &&
    playingTrackId === currentTrack.id &&
    Boolean(persistentPlayer.audio && !persistentPlayer.audio.paused)

  const progress = trackDuration > 0 ? Math.min(100, (elapsedSeconds / trackDuration) * 100) : 0

  function updateStateFromAudio(audio) {
    if (!mountedRef.current) return

    setElapsedSeconds(audio.currentTime || 0)

    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDurationSeconds(audio.duration)
    }
  }

  function bindAudio(audio) {
    audio.ontimeupdate = () => updateStateFromAudio(audio)

    audio.onloadedmetadata = () => {
      if (!mountedRef.current) return
      if (Number.isFinite(audio.duration)) setDurationSeconds(audio.duration)
      setIsLoopEnabled(Boolean(audio.loop))
    }

    audio.onended = () => {
      persistentPlayer.trackId = null
      persistentPlayer.status = "done"
      if (!mountedRef.current) return
      setPlayingTrackId(null)
      setElapsedSeconds(0)
      setDurationSeconds(0)
    }

    audio.onerror = () => {
      persistentPlayer.trackId = null
      persistentPlayer.status = "error"
      if (!mountedRef.current) return
      setPlayingTrackId(null)
      setElapsedSeconds(0)
      setDurationSeconds(0)
    }
  }

  function syncTrack(sourcePlaylists) {
    if (!persistentPlayer.trackId) return

    const playlist = sourcePlaylists.find((item) =>
      item.tracks.some((track) => track.id === persistentPlayer.trackId)
    )
    if (!playlist) return

    const index = playlist.tracks.findIndex((track) => track.id === persistentPlayer.trackId)

    setActivePlaylistId(playlist.id)
    setActiveTrackIndex(Math.max(0, index))

    if (persistentPlayer.audio) {
      updateStateFromAudio(persistentPlayer.audio)
    }
  }

  function applyDefaultSelection(sourcePlaylists) {
    const fallbackId = getDefaultPlaylistId(sourcePlaylists)
    const selection = pickRandomTrackFromPlaylist(sourcePlaylists, fallbackId)

    setActivePlaylistId(selection?.playlistId || fallbackId)
    setActiveTrackIndex(selection?.trackIndex || 0)

    if (!selection || persistentPlayer.userOverridden) return

    playTrack(selection.track, { loop: true, userOverride: false })
    setIsLoopEnabled(true)
  }

  useEffect(() => {
    mountedRef.current = true

    const audio = persistentPlayer.audio
    if (audio) {
      bindAudio(audio)
      updateStateFromAudio(audio)
      if (!audio.paused && persistentPlayer.trackId) {
        setPlayingTrackId(persistentPlayer.trackId)
      }
    }

    let cancelled = false

    async function loadLibrary() {
      try {
        const response = await fetch("/api/audio")
        const data = await response.json()

        if (cancelled) return

        const nextPlaylists = Array.isArray(data.playlists) ? data.playlists : []

        setPlaylists(nextPlaylists)
        setAllTracks(
          Array.isArray(data.allTracks)
            ? data.allTracks
            : nextPlaylists.flatMap((playlist) => playlist.tracks)
        )

        if (nextPlaylists.length === 0) {
          setLoadStatus("empty")
          return
        }

        setLoadStatus("ready")

        if (persistentPlayer.trackId) {
          syncTrack(nextPlaylists)
        } else {
          applyDefaultSelection(nextPlaylists)
        }
      } catch {
        if (!cancelled) setLoadStatus("error")
      }
    }

    loadLibrary()

    const timer = window.setInterval(() => {
      if (!mountedRef.current) return
      if (!persistentPlayer.audio) return
      updateStateFromAudio(persistentPlayer.audio)
    }, 250)

    return () => {
      mountedRef.current = false
      cancelled = true
      window.clearInterval(timer)
    }
  }, [])

  function stopPlayback() {
    if (persistentPlayer.audio) {
      persistentPlayer.audio.pause()
      persistentPlayer.audio.currentTime = 0
      persistentPlayer.audio = null
    }

    persistentPlayer.trackId = null
    persistentPlayer.status = "stopped"

    setPlayingTrackId(null)
    setElapsedSeconds(0)
    setDurationSeconds(0)
  }

  function playTrack(track, options = {}) {
    const { loop = isLoopEnabled, userOverride = true } = options
    if (!track) return

    if (userOverride) persistentPlayer.userOverridden = true

    stopPlayback()

    const audio = new Audio(track.src)
    audio.loop = loop

    persistentPlayer.audio = audio
    persistentPlayer.trackId = track.id
    persistentPlayer.status = "loading"

    bindAudio(audio)

    setElapsedSeconds(0)
    setDurationSeconds(0)

    audio
      .play()
      .then(() => {
        persistentPlayer.status = "playing"
        if (!mountedRef.current) return
        setPlayingTrackId(track.id)
      })
      .catch(() => {
        persistentPlayer.audio = null
        persistentPlayer.trackId = null
        persistentPlayer.status = "error"
        if (!mountedRef.current) return
        setPlayingTrackId(null)
      })
  }

  function selectTrack(index, autoplay = false) {
    const track = currentTracks[index]

    setActiveTrackIndex(index)
    setElapsedSeconds(0)
    setDurationSeconds(0)

    if (autoplay && track) playTrack(track)
  }

  function handlePlayPause() {
    if (!currentTrack) return

    persistentPlayer.userOverridden = true

    const audio = persistentPlayer.audio

    if (audio && persistentPlayer.trackId === currentTrack.id) {
      if (audio.paused) {
        audio.play().then(() => {
          persistentPlayer.status = "playing"
          if (mountedRef.current) setPlayingTrackId(currentTrack.id)
        })
        return
      }

      audio.pause()
      persistentPlayer.status = "paused"
      setPlayingTrackId(null)
      return
    }

    playTrack(currentTrack)
  }

  function handleSeek(event) {
    const audio = persistentPlayer.audio
    if (!audio || !trackDuration) return

    const nextTime = Number(event.target.value)
    audio.currentTime = nextTime
    setElapsedSeconds(nextTime)
  }

  function handlePrev() {
    if (!currentTracks.length) return
    persistentPlayer.userOverridden = true
    const nextIndex = (activeTrackIndex - 1 + currentTracks.length) % currentTracks.length
    selectTrack(nextIndex, isPlaying)
  }

  function handleNext() {
    if (!currentTracks.length) return
    persistentPlayer.userOverridden = true
    const nextIndex = (activeTrackIndex + 1) % currentTracks.length
    selectTrack(nextIndex, isPlaying)
  }

  function handleShuffle() {
    if (!allTracks.length) return

    persistentPlayer.userOverridden = true

    const track = allTracks[Math.floor(Math.random() * allTracks.length)]
    const playlist = playlists.find((item) => item.tracks.some((t) => t.id === track.id))

    if (playlist) {
      const index = playlist.tracks.findIndex((t) => t.id === track.id)
      setActivePlaylistId(playlist.id)
      setActiveTrackIndex(index)
    }

    playTrack(track)
  }

  function handleLoopToggle() {
    persistentPlayer.userOverridden = true

    const nextLoop = !isLoopEnabled
    setIsLoopEnabled(nextLoop)

    if (persistentPlayer.audio) {
      persistentPlayer.audio.loop = nextLoop
    }
  }

  function handlePlaylistChange(event) {
    persistentPlayer.userOverridden = true

    if (persistentPlayer.audio) stopPlayback()

    setActivePlaylistId(event.target.value)
    setActiveTrackIndex(0)
    setElapsedSeconds(0)
    setDurationSeconds(0)
  }

  function handleTrackChange(event) {
    persistentPlayer.userOverridden = true

    const index = currentTracks.findIndex((track) => track.id === event.target.value)
    if (index >= 0) selectTrack(index, isPlaying)
  }

  if (loadStatus === "loading") {
    return (
      <section className={styles.panel} aria-label="Speaker player">
        <header className={styles.chromeBar}>
          <div className={styles.brandGroup}>
            <span className={styles.statusLamp} />
            <span className={styles.brand}>Desk Speaker Classic</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close speaker">
            x
          </button>
        </header>
        <div className={styles.emptyState}>
          <IconNote />
          <p>tuning in...</p>
        </div>
      </section>
    )
  }

  if (loadStatus === "empty" || loadStatus === "error") {
    return (
      <section className={styles.panel} aria-label="Speaker player">
        <header className={styles.chromeBar}>
          <div className={styles.brandGroup}>
            <span className={styles.statusLamp} />
            <span className={styles.brand}>Desk Speaker Classic</span>
          </div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close speaker">
            x
          </button>
        </header>
        <div className={styles.emptyState}>
          <IconNote />
          <p>{loadStatus === "empty" ? "no tracks yet" : "could not load the music library"}</p>
          <span>drop some audio into public/audio and refresh</span>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.panel} aria-label="Speaker player">
      <header className={styles.chromeBar}>
        <div className={styles.brandGroup}>
          <span className={`${styles.statusLamp} ${isPlaying ? styles.statusLampActive : ""}`} />
          <span className={styles.brand}>Desk Speaker Classic</span>
        </div>

        <button className={styles.closeButton} onClick={onClose} aria-label="Close speaker">
          x
        </button>
      </header>

      <div className={styles.main}>
        <div className={styles.display}>
          <div className={styles.displayInfo}>
            <span className={styles.displayLabel}>{isPlaying ? "PLAYING" : "READY"}</span>
            <strong className={styles.trackTitle} title={currentTrack?.title}>
              {currentTrack?.title || "No Track"}
            </strong>
            <span className={styles.playlistName}>{currentPlaylist?.label || "No Folder"}</span>
          </div>

          <div className={styles.clock}>
            <span>{formatTime(elapsedSeconds)}</span>
            <small>{formatTime(trackDuration)}</small>
          </div>

          <div className={styles.equalizer}>
            {Array.from({ length: 8 }).map((_, index) => (
              <i
                key={index}
                className={isPlaying ? styles.eqBarActive : styles.eqBar}
                style={{ animationDelay: `${index * 70}ms` }}
              />
            ))}
          </div>
        </div>

        <div className={styles.seek}>
          <input
            type="range"
            min="0"
            max={trackDuration || 0}
            step="0.1"
            value={Math.min(elapsedSeconds, trackDuration || 0)}
            onChange={handleSeek}
            disabled={!persistentPlayer.audio || !trackDuration}
            aria-label="Track progress"
            style={{ "--progress": `${progress}%` }}
          />
        </div>

        <div className={styles.selectors}>
          <select value={activePlaylistId} onChange={handlePlaylistChange} aria-label="Select folder">
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.label}
              </option>
            ))}
          </select>

          <select value={currentTrack?.id || ""} onChange={handleTrackChange} aria-label="Select song">
            {currentTracks.map((track, index) => (
              <option key={track.id} value={track.id}>
                {index + 1}. {track.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.controls}>
          <button onClick={handlePrev} aria-label="Previous track">
            <IconPrev />
          </button>

          <button className={styles.primaryControl} onClick={handlePlayPause} aria-label={isPlaying ? "Pause" : "Play"}>
            {isPlaying ? <IconPause /> : <IconPlay />}
          </button>

          <button onClick={handleNext} aria-label="Next track">
            <IconNext />
          </button>

          <button
            onClick={() => {
              persistentPlayer.userOverridden = true
              stopPlayback()
            }}
            aria-label="Stop"
          >
            <IconStop />
          </button>

          <button onClick={handleShuffle} aria-label="Shuffle" title="Shuffle">
            <IconShuffle />
          </button>

          <button
            className={isLoopEnabled ? styles.loopButtonActive : undefined}
            onClick={handleLoopToggle}
            aria-label={isLoopEnabled ? "Disable loop" : "Enable loop"}
            aria-pressed={isLoopEnabled}
            title={isLoopEnabled ? "Loop on" : "Loop off"}
          >
            <IconLoop />
          </button>
        </div>
      </div>
    </section>
  )
}
