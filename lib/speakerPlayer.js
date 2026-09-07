import { getDefaultPlaylistId, pickRandomTrackFromPlaylist } from "@/lib/music"

export const persistentSpeakerPlayer = {
  audio: null,
  trackId: null,
  status: "ready",
  userOverridden: false
}

function pickRandom(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null
  }

  return items[Math.floor(Math.random() * items.length)]
}

function getDefaultSelection(sourcePlaylists) {
  if (!Array.isArray(sourcePlaylists) || sourcePlaylists.length === 0) {
    return null
  }

  const lofiPlaylist = sourcePlaylists.find(
    (playlist) => playlist.id === "lo-fi" && Array.isArray(playlist.tracks) && playlist.tracks.length > 0
  )

  if (lofiPlaylist) {
    const trackIndex = Math.floor(Math.random() * lofiPlaylist.tracks.length)
    return {
      playlistId: lofiPlaylist.id,
      trackIndex,
      track: lofiPlaylist.tracks[trackIndex]
    }
  }

  const lofiTracks = sourcePlaylists.flatMap((playlist) =>
    (playlist.tracks || [])
      .map((track, trackIndex) => ({ playlist, track, trackIndex }))
      .filter((item) => item.track?.src?.includes("/audio/lo-fi/"))
  )

  const pickedLofiTrack = pickRandom(lofiTracks)
  if (pickedLofiTrack) {
    return {
      playlistId: pickedLofiTrack.playlist.id,
      trackIndex: pickedLofiTrack.trackIndex,
      track: pickedLofiTrack.track
    }
  }

  const defaultPlaylistId = getDefaultPlaylistId(sourcePlaylists)
  return pickRandomTrackFromPlaylist(sourcePlaylists, defaultPlaylistId)
}

export function startDefaultSpeakerLoop(sourcePlaylists) {
  if (persistentSpeakerPlayer.userOverridden || persistentSpeakerPlayer.audio) {
    return null
  }

  const selection = getDefaultSelection(sourcePlaylists)

  if (!selection?.track) {
    return null
  }

  const audio = new Audio(selection.track.src)
  audio.loop = true

  persistentSpeakerPlayer.audio = audio
  persistentSpeakerPlayer.trackId = selection.track.id
  persistentSpeakerPlayer.status = "loading"

  audio
    .play()
    .then(() => {
      persistentSpeakerPlayer.status = "playing"
    })
    .catch(() => {
      persistentSpeakerPlayer.audio = null
      persistentSpeakerPlayer.trackId = null
      persistentSpeakerPlayer.status = "error"
    })

  return selection
}
