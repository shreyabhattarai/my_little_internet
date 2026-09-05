// Useless interactions
// These exist purely because they are funny
// No engagement optimization intended

export const uselessResponses = {
  plant: [
    "the plant does nothing",
    "still a plant",
    "you watered a jpeg, nice",
    "the plant appreciates the attention it cannot feel"
  ],
  chair: [
    "you sit down, nothing happens",
    "the chair is surprisingly comfortable for a rectangle",
    "you get up again, still nothing happened"
  ],
  cat: [
    "the cat walks away",
    "the cat did not consent to this interaction",
    "the cat has left the room, emotionally and physically"
  ],
  counter: [
    "counter is now at {n}, this number means nothing",
    "you have clicked a meaningless button {n} times",
    "somewhere a server did not even notice this happened, count is {n}"
  ]
}

export function getRandomResponse(key) {
  const list = uselessResponses[key] || ["nothing happens"]
  return list[Math.floor(Math.random() * list.length)]
}

// Trash folder contents for the fake computer
export const trashContents = [
  { id: "t-1", name: "definitely_not_important.txt" },
  { id: "t-2", name: "old_password_ideas.txt" },
  { id: "t-3", name: "screenshot_2025_explain_later.png" },
  { id: "t-4", name: "why_did_i_save_this.file" },
  { id: "t-5", name: "untitled_folder_final(3).zip" }
]
