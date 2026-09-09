// Persistent audio player
// Lives outside react so the same audio element survives modal open and close
import { pickAmbientTrack } from "@/lib/music"

export const persistentSpeakerPlayer = {
  audio: null,
  trackId: null,
  status: "ready",
  userOverridden: false
}

// Starts the ambient loop once, on first user interaction
// Does nothing if the user already picked a track, or nothing is available yet
export function startDefaultSpeakerLoop(sourcePlaylists) {
  if (persistentSpeakerPlayer.userOverridden || persistentSpeakerPlayer.audio) {
    return null
  }

  const selection = pickAmbientTrack(sourcePlaylists)

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
