// Life feed
// Short casual entries, not a blog
// Newest first

export const feedEntries = [
  {
    id: "f-1",
    date: "2026-09-02",
    tag: "built",
    text: "spent way too long deciding the color of a fake plant"
  },
  {
    id: "f-2",
    date: "2026-08-30",
    tag: "broke",
    text: "the character got stuck inside the wardrobe for an entire afternoon"
  },
  {
    id: "f-3",
    date: "2026-08-27",
    tag: "watched",
    text: "rewatched the same three episodes instead of new ones again"
  },
  {
    id: "f-4",
    date: "2026-08-24",
    tag: "thought",
    text: "what if drawers could just be drawers, no lesson needed"
  },
  {
    id: "f-5",
    date: "2026-08-19",
    tag: "ate",
    text: "reheated the same bowl of noodles three times in one day"
  },
  {
    id: "f-6",
    date: "2026-08-14",
    tag: "achievement",
    text: "finally fixed the bug that made the cat walk sideways"
  },
  {
    id: "f-7",
    date: "2026-08-09",
    tag: "mistake",
    text: "deleted a file called final final actually final"
  }
]

export function getFeedByTag(tag) {
  return feedEntries.filter((e) => e.tag === tag)
}
