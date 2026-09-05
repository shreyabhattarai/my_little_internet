// Fake computer content
// Defines the apps and files visible on the fake desktop

export const desktopApps = [
  { id: "photos", label: "Photos", icon: "square" },
  { id: "music", label: "Music", icon: "circle" },
  { id: "notes", label: "Notes", icon: "square" },
  { id: "internet", label: "Internet", icon: "circle" },
  { id: "trash", label: "Trash", icon: "square" }
]

export const notesContent = [
  {
    id: "note-1",
    title: "things to build",
    body: "a tiny arcade, a better bookshelf, a room that changes with the seasons"
  },
  {
    id: "note-2",
    title: "reminder",
    body: "not everything needs a purpose, some things can just exist"
  },
  {
    id: "note-3",
    title: "random thought at 2am",
    body: "what if the internet used to feel more like a place and less like a feed"
  }
]

export const internetLinks = [
  { id: "l-1", label: "an old forum I still miss", note: "mostly dead now, still visit sometimes" },
  { id: "l-2", label: "a fan wiki for a show nobody else watched", note: "extremely detailed, extremely niche" },
  { id: "l-3", label: "a page that only exists to test something", note: "left online by accident, kept on purpose" }
]
