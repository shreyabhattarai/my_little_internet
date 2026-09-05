// World config
// This file describes the explorable world as data
// Rooms zones and objects are defined here not inside components

export const WORLD_WIDTH = 1672
export const WORLD_HEIGHT = 941

// Starting position of the character in the room
export const START_POSITION = { x: 836, y: 820 }

// Movement speed in pixels per second
export const MOVE_SPEED = 220

// Each zone is a rectangle the character can walk into or click
// type modal opens a real panel
// type useless just fires a silly reaction with no lasting effect
// type secretTrigger increments a hidden counter
export const ZONES = [
  {
    id: "window",
    label: "Window",
    imageId: "windowFrame",
    x: 650,
    y: 100,
    width: 380,
    height: 420,
    color: "#9db7c8",
    type: "modal",
    modal: "window",
    hint: "a view outside that changes with the time of day"
  },
  {
    id: "photoFrame",
    label: "Photo Frame",
    imageId: "photoFrame",
    x: 880,
    y: 95,
    width: 800,
    height: 295,
    color: "#b58c5b",
    type: "modal",
    modal: "photoFrame",
    hint: "family photos hanging in the top right corner"
  },
  {
    id: "desk",
    label: "Desk",
    imageId: "desk",
    x: 580,
    y: 400,
    width: 500,
    height: 440,
    color: "#c98a4b",
    type: "modal",
    modal: "feed",
    hint: "current obsessions and small updates"
  },
  {
    id: "computer",
    label: "Computer",
    imageId: "computer",
    x: 620,
    y: 370,
    width: 250,
    height: 230,
    color: "#3d4a63",
    type: "modal",
    modal: "computer",
    hint: "a whole fake desktop lives in here"
  },
  // {
  //   id: "bed",
  //   label: "Bed",
  //   imageId: "bed",
  //   x: 1155,
  //   y: 700,
  //   width: 410,
  //   height: 240,
  //   color: "#5e6ba8",
  //   type: "modal",
  //   modal: "bed",
  //   hint: "sleep related nonsense"
  // },
  {
    id: "bookshelf",
    label: "Bookshelf",
    imageId: "bookshelf",
    x: 160,
    y: 90,
    width: 380,
    height: 700,
    color: "#7c5a3f",
    type: "modal",
    modal: "bookshelf",
    hint: "things I like to read and watch"
  },
  {
    id: "musicArea",
    label: "Speaker",
    imageId: "speaker",
    x: 350,
    y: 310,
    width: 90,
    height: 92,
    color: "#a1487e",
    type: "modal",
    modal: "music",
    hint: "a small speaker that plays small songs"
  },
  {
    id: "plant",
    label: "Plant",
    imageId: "plant",
    x: 1050,
    y: 580,
    width: 130,
    height: 165,
    color: "#4c8c5a",
    type: "useless",
    uselessId: "plant",
    hint: "it is a plant"
  },
  // {
  //   id: "wardrobe",
  //   label: "Wardrobe",
  //   imageId: "wardrobe",
  //   x: 1320,
  //   y: 255,
  //   width: 280,
  //   height: 600,
  //   color: "#8c6b4c",
  //   type: "modal",
  //   modal: "wardrobe",
  //   hint: "clothes and a few secrets"
  // },
  {
    id: "chair",
    label: "Chair",
    imageId: "chair",
    x: 730,
    y: 470,
    width: 230,
    height: 380,
    color: "#b06b3a",
    type: "useless",
    uselessId: "chair",
    hint: "you can sit but nothing happens"
  },
  {
    id: "cat",
    label: "Cat",
    imageId: "cat",
    x: 870,
    y: 475,
    width: 80,
    height: 100,
    color: "#333333",
    type: "useless",
    uselessId: "cat",
    hint: "a small cat shaped rectangle"
  },
  // Future addition:
  // {
  //   id: "counter",
  //   label: "Mystery Button",
  //   x: 910,
  //   y: 575,
  //   width: 50,
  //   height: 40,
  //   color: "#d1c14c",
  //   type: "useless",
  //   uselessId: "counter",
  //   hint: "counts something that does not matter"
  // },
  // {
  //   id: "drawer",
  //   label: "Drawer",
  //   x: 660,
  //   y: 725,
  //   width: 135,
  //   height: 50,
  //   color: "#9c7a53",
  //   type: "secretTrigger",
  //   hint: "click me a few times"
  // },
  {
    id: "mirror",
    label: "Mirror",
    x: 445,
    y: 360,
    width: 70,
    height: 170,
    color: "#bcd6e0",
    type: "modal",
    modal: "mirror",
    hint: "a simple reflection of me"
  },
  {
    id: "arcade",
    label: "Arcade",
    imageId: "arcade",
    x: 40,
    y: 680,
    width: 170,
    height: 170,
    color: "#4b6ea8",
    type: "modal",
    modal: "arcade",
    hint: "a tiny corner of pointless games"
  },
  // {
  //   id: "brainrot",
  //   label: "The Internet",
  //   x: 1030,
  //   y: 175,
  //   width: 140,
  //   height: 110,
  //   color: "#6a4b8c",
  //   type: "modal",
  //   modal: "brainrot",
  //   hint: "absolutely nothing important lives here"
  // }
]

// Visual decor positions used by the room renderer
export const ROOM_DECOR = ZONES.filter((zone) => zone.imageId).map((zone) => ({
    id: zone.imageId,
    x: zone.x,
    y: zone.y,
    width: zone.width,
    height: zone.height
}))

// The Konami style key sequence that unlocks a hidden room
export const SECRET_KEY_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight"
]

// Future addition:
// Number of clicks on the drawer needed to reveal the hidden compartment.
// export const DRAWER_CLICKS_NEEDED = 5

export const TIME_TINTS = {
  day: "rgba(255, 235, 200, 0.06)",
  dusk: "rgba(255, 140, 120, 0.14)",
  night: "rgba(15, 15, 45, 0.55)"
}

export const WINDOW_VIEWS = {
  day: "/images/window_views/day.jpeg",
  dusk: "/images/window_views/dusk.jpeg",
  night: "/images/window_views/night.jpeg"
}

export const WINDOW_VIEWPORT = {
  x: 750,
  y: 200,
  width: 180,
  height: 220
}

// Manual viewport for the photo that appears inside the wall frame.
// Tune these pixel values directly to align with your specific frame asset.
export const PHOTO_FRAME_VIEWPORT = {
  x: 1180,
  y: 150,
  width: 210,
  height: 180
}

export const WINDOW_PERIODS = ["day", "dusk", "night"]

// Simple helper that classifies the current hour into a period of day
export function getTimePeriod(date) {
  const hour = date.getHours()
  if ((hour >= 5 && hour < 8) || (hour >= 17 && hour < 20)) return "dusk"
  if (hour >= 8 && hour < 17) return "day"
  return "night"
}

export function getEffectivePeriod(overridePeriod, date) {
  if (WINDOW_PERIODS.includes(overridePeriod)) return overridePeriod
  return getTimePeriod(date)
}

export function isLateNight(date) {
  const hour = date.getHours()
  return hour >= 1 && hour < 5
}
