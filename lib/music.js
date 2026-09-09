// Music helpers
// Playlists always come from the audio api, scanned from public/audio
// This file only picks sensible defaults from whatever list it is given

export const DEFAULT_PLAYLIST_ID = "lo-fi"

// Prefer the lo-fi folder if it exists, otherwise just take the first one
export function getDefaultPlaylistId(sourcePlaylists) {
  if (!Array.isArray(sourcePlaylists) || sourcePlaylists.length === 0) return ""
  const preferred = sourcePlaylists.find((p) => p.id === DEFAULT_PLAYLIST_ID)
  return preferred ? preferred.id : sourcePlaylists[0].id
}

export function pickRandomTrackFromPlaylist(sourcePlaylists, playlistId) {
  if (!Array.isArray(sourcePlaylists) || sourcePlaylists.length === 0) return null

  const selected =
    sourcePlaylists.find((p) => p.id === playlistId) || sourcePlaylists[0]

  if (!selected?.tracks?.length) return null

  const index = Math.floor(Math.random() * selected.tracks.length)
  return { playlistId: selected.id, trackIndex: index, track: selected.tracks[index] }
}

// Picks a random track from the lo-fi folder if it has one, else from
// anywhere in the library. Used for the ambient loop on first interaction.
export function pickAmbientTrack(sourcePlaylists) {
  if (!Array.isArray(sourcePlaylists) || sourcePlaylists.length === 0) return null

  const lofi = sourcePlaylists.find(
    (p) => p.id === DEFAULT_PLAYLIST_ID && p.tracks?.length
  )

  if (lofi) {
    const index = Math.floor(Math.random() * lofi.tracks.length)
    return { playlistId: lofi.id, trackIndex: index, track: lofi.tracks[index] }
  }

  const withTracks = sourcePlaylists.filter((p) => p.tracks?.length)
  if (withTracks.length === 0) return null

  return pickRandomTrackFromPlaylist(withTracks, withTracks[0].id)
}
