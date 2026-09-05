// Music library fallback
// Real files are discovered from public/audio by the audio API route
// Audio is always optional and user controlled, never autoplay

export const playlists = [
  {
    id: "late-night",
    label: "Late Night",
    description: "for when the room is dark and the mind is loud",
    tracks: [
      { id: "ln-1", title: "3am Thoughts", src: "/assets/audio/placeholder-late-night-1.mp3", duration: "2:40" },
      { id: "ln-2", title: "Streetlight Hum", src: "/audio/lo-fi/streetlight-hum.mp3", duration: "3:05" }
    ]
  },
  {
    id: "study",
    label: "Study",
    description: "background noise for getting things done, slowly",
    tracks: [
      { id: "st-1", title: "Focus Loop", src: "/audio/english/focus-loop.mp3", duration: "4:12" },
      { id: "st-2", title: "Quiet Desk", src: "/audio/english/quiet-desk.mp3", duration: "3:30" }
    ]
  },
  {
    id: "walking",
    label: "Walking",
    description: "for wandering around with no destination",
    tracks: [
      { id: "wk-1", title: "Slow Steps", src: "/audio/nepali/slow-steps.mp3", duration: "2:58" }
    ]
  },
  {
    id: "sad",
    label: "Sad",
    description: "for the days that need a soundtrack",
    tracks: [
      { id: "sd-1", title: "Rain On Glass", src: "/audio/hindi/rain-on-glass.mp3", duration: "3:44" }
    ]
  },
  {
    id: "chill",
    label: "Chill",
    description: "for doing nothing in particular",
    tracks: [
      { id: "ch-1", title: "Soft Static", src: "/audio/lo-fi/soft-static.mp3", duration: "2:20" }
    ]
  },
  {
    id: "nostalgic",
    label: "Nostalgic",
    description: "songs that feel like an old memory card",
    tracks: [
      { id: "no-1", title: "Old Save File", src: "/audio/nepali/old-save-file.mp3", duration: "3:15" }
    ]
  },
  {
    id: "brainrot",
    label: "Brainrot",
    description: "no context provided, none needed",
    tracks: [
      { id: "br-1", title: "Untitled Nonsense", src: "/audio/memes/rick-roll.mp3", duration: "0:42" }
    ]
  }
]

export function getPlaylistById(id) {
  return playlists.find((p) => p.id === id)
}
