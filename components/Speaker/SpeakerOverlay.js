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
return ( <svg viewBox="0 0 24 24" aria-hidden="true"> <rect x="4" y="5" width="2" height="14" rx="1" /> <path d="M18 6L8 12L18 18V6Z" /> </svg>
)
}

function IconPlay() {
return ( <svg viewBox="0 0 24 24" aria-hidden="true"> <path d="M8 6L19 12L8 18V6Z" /> </svg>
)
}

function IconPause() {
return ( <svg viewBox="0 0 24 24" aria-hidden="true"> <rect x="7" y="6" width="3.5" height="12" rx="1" /> <rect x="13.5" y="6" width="3.5" height="12" rx="1" /> </svg>
)
}

function IconNext() {
return ( <svg viewBox="0 0 24 24" aria-hidden="true"> <rect x="18" y="5" width="2" height="14" rx="1" /> <path d="M6 6L16 12L6 18V6Z" /> </svg>
)
}

function IconStop() {
return ( <svg viewBox="0 0 24 24" aria-hidden="true"> <rect x="7" y="7" width="10" height="10" rx="1" /> </svg>
)
}

function IconShuffle() {
return ( <svg viewBox="0 0 24 24" aria-hidden="true"> <path d="M16 7H21V2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21 2L13 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M5 5L10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M16 17H21V22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21 22L13 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> <path d="M5 19L10 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> </svg>
)
}

function formatTime(seconds) {
const safe = Number.isFinite(seconds)
? Math.max(0, Math.floor(seconds))
: 0

const minutes = Math.floor(safe / 60)
const remaining = String(safe % 60).padStart(2, "0")

return `${String(minutes).padStart(2, "0")}:${remaining}`
}

function parseDuration(value) {
if (!value || typeof value !== "string") return 0

const parts = value.split(":").map(Number)

if (parts.some(Number.isNaN)) return 0

if (parts.length === 2) {
return parts[0] * 60 + parts[1]
}

if (parts.length === 3) {
return parts[0] * 3600 + parts[1] * 60 + parts[2]
}

return 0
}

export default function SpeakerOverlay({ onClose }) {
const mountedRef = useRef(false)

const [playlists, setPlaylists] = useState(fallbackPlaylists)
const [allTracks, setAllTracks] = useState([])
const [activePlaylistId, setActivePlaylistId] = useState(
fallbackPlaylists[0]?.id || ""
)
const [activeTrackIndex, setActiveTrackIndex] = useState(0)
const [playingTrackId, setPlayingTrackId] = useState(
persistentPlayer.trackId
)
const [elapsedSeconds, setElapsedSeconds] = useState(
persistentPlayer.audio?.currentTime || 0
)
const [durationSeconds, setDurationSeconds] = useState(
persistentPlayer.audio?.duration || 0
)

const currentPlaylist =
playlists.find((playlist) => playlist.id === activePlaylistId) ||
playlists[0]

const currentTracks = currentPlaylist?.tracks || []

const currentTrack =
currentTracks[activeTrackIndex] || currentTracks[0]

const metadataDuration = parseDuration(currentTrack?.duration)

const trackDuration =
durationSeconds > 0 ? durationSeconds : metadataDuration

const isPlaying =
Boolean(currentTrack) &&
playingTrackId === currentTrack.id &&
Boolean(
persistentPlayer.audio &&
!persistentPlayer.audio.paused
)

const progress =
trackDuration > 0
? Math.min(100, (elapsedSeconds / trackDuration) * 100)
: 0

function updateStateFromAudio(audio) {
if (!mountedRef.current) return

setElapsedSeconds(audio.currentTime || 0)

if (Number.isFinite(audio.duration) && audio.duration > 0) {
  setDurationSeconds(audio.duration)
}

}

function bindAudio(audio) {
audio.ontimeupdate = () => {
updateStateFromAudio(audio)
}

audio.onloadedmetadata = () => {
  if (!mountedRef.current) return

  if (Number.isFinite(audio.duration)) {
    setDurationSeconds(audio.duration)
  }
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
  item.tracks.some(
    (track) => track.id === persistentPlayer.trackId
  )
)

if (!playlist) return

const index = playlist.tracks.findIndex(
  (track) => track.id === persistentPlayer.trackId
)

setActivePlaylistId(playlist.id)
setActiveTrackIndex(Math.max(0, index))

if (persistentPlayer.audio) {
  updateStateFromAudio(persistentPlayer.audio)
}

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

    if (
      Array.isArray(data.playlists) &&
      data.playlists.length > 0
    ) {
      setPlaylists(data.playlists)
      setAllTracks(
        Array.isArray(data.allTracks)
          ? data.allTracks
          : data.playlists.flatMap(
              (playlist) => playlist.tracks
            )
      )

      if (persistentPlayer.trackId) {
        syncTrack(data.playlists)
      } else {
        setActivePlaylistId(data.playlists[0].id)
      }

      return
    }

    useFallbackLibrary()
  } catch {
    if (!cancelled) {
      useFallbackLibrary()
    }
  }
}

function useFallbackLibrary() {
  const tracks = fallbackPlaylists.flatMap(
    (playlist) => playlist.tracks
  )

  setPlaylists(fallbackPlaylists)
  setAllTracks(tracks)

  if (persistentPlayer.trackId) {
    syncTrack(fallbackPlaylists)
  } else {
    setActivePlaylistId(
      fallbackPlaylists[0]?.id || ""
    )
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

function playTrack(track) {
stopPlayback()

const audio = new Audio(track.src)

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

if (autoplay && track) {
  playTrack(track)
}

}

function handlePlayPause() {
if (!currentTrack) return

const audio = persistentPlayer.audio

if (
  audio &&
  persistentPlayer.trackId === currentTrack.id
) {
  if (audio.paused) {
    audio.play().then(() => {
      persistentPlayer.status = "playing"

      if (mountedRef.current) {
        setPlayingTrackId(currentTrack.id)
      }
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

const nextIndex =
  (activeTrackIndex - 1 + currentTracks.length) %
  currentTracks.length

selectTrack(nextIndex, isPlaying)

}

function handleNext() {
if (!currentTracks.length) return

const nextIndex =
  (activeTrackIndex + 1) % currentTracks.length

selectTrack(nextIndex, isPlaying)

}

function handleShuffle() {
if (!allTracks.length) return

const track =
  allTracks[Math.floor(Math.random() * allTracks.length)]

const playlist = playlists.find((item) =>
  item.tracks.some(
    (candidate) => candidate.id === track.id
  )
)

if (playlist) {
  const index = playlist.tracks.findIndex(
    (candidate) => candidate.id === track.id
  )

  setActivePlaylistId(playlist.id)
  setActiveTrackIndex(index)
}

playTrack(track)

}

return ( <section
   className={styles.panel}
   aria-label="Speaker player"
 > <header className={styles.chromeBar}> <div className={styles.brandGroup}>
<span
className={`${styles.statusLamp} ${
              isPlaying ? styles.statusLampActive : ""
            }`}
/>

      <span className={styles.brand}>
        Desk Speaker Classic
      </span>
    </div>

    <button
      className={styles.closeButton}
      onClick={onClose}
      aria-label="Close speaker"
    >
      x
    </button>
  </header>

  <div className={styles.main}>
    <div className={styles.display}>
      <div className={styles.displayInfo}>
        <span className={styles.displayLabel}>
          {isPlaying ? "PLAYING" : "READY"}
        </span>

        <strong
          className={styles.trackTitle}
          title={currentTrack?.title}
        >
          {currentTrack?.title || "No Track"}
        </strong>

        <span className={styles.playlistName}>
          {currentPlaylist?.label || "No Folder"}
        </span>
      </div>

      <div className={styles.clock}>
        <span>{formatTime(elapsedSeconds)}</span>
        <small>
          {formatTime(trackDuration)}
        </small>
      </div>

      <div className={styles.equalizer}>
        {Array.from({ length: 8 }).map((_, index) => (
          <i
            key={index}
            className={
              isPlaying
                ? styles.eqBarActive
                : styles.eqBar
            }
            style={{
              animationDelay: `${index * 70}ms`
            }}
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
        value={Math.min(
          elapsedSeconds,
          trackDuration || 0
        )}
        onChange={handleSeek}
        disabled={!persistentPlayer.audio || !trackDuration}
        aria-label="Track progress"
        style={{
          "--progress": `${progress}%`
        }}
      />
    </div>

    <div className={styles.selectors}>
      <select
        value={activePlaylistId}
        onChange={(event) => {
          if (persistentPlayer.audio) {
            stopPlayback()
          }

          setActivePlaylistId(event.target.value)
          setActiveTrackIndex(0)
          setElapsedSeconds(0)
          setDurationSeconds(0)
        }}
        aria-label="Select folder"
      >
        {playlists.map((playlist) => (
          <option
            key={playlist.id}
            value={playlist.id}
          >
            {playlist.label}
          </option>
        ))}
      </select>

      <select
        value={currentTrack?.id || ""}
        onChange={(event) => {
          const index = currentTracks.findIndex(
            (track) =>
              track.id === event.target.value
          )

          if (index >= 0) {
            selectTrack(index, isPlaying)
          }
        }}
        aria-label="Select song"
      >
        {currentTracks.map((track, index) => (
          <option
            key={track.id}
            value={track.id}
          >
            {index + 1}. {track.title}
          </option>
        ))}
      </select>
    </div>

    <div className={styles.controls}>
      <button
        onClick={handlePrev}
        aria-label="Previous track"
      >
        <IconPrev />
      </button>

      <button
        className={styles.primaryControl}
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <IconPause /> : <IconPlay />}
      </button>

      <button
        onClick={handleNext}
        aria-label="Next track"
      >
        <IconNext />
      </button>

      <button
        onClick={stopPlayback}
        aria-label="Stop"
      >
        <IconStop />
      </button>

      <button
        onClick={handleShuffle}
        aria-label="Shuffle"
        title="Shuffle"
      >
        <IconShuffle />
      </button>
    </div>
  </div>
</section>

)
}
