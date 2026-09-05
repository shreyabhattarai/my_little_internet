// Photo entries
// These cover the real image files in the public gallery folders.
// Excluded folders: assets, memes, window_views, placeholders.

export const photos = [
  {
    id: "photo-1",
    src: "/images/family/with_mom.jpg",
    location: "family album",
    date: "2024-03-12",
    caption: "an afternoon with mom and a lot of laughter",
    memory: "this one always feels warm no matter when I look at it"
  },
  {
    id: "photo-2",
    src: "/images/family/with_mom1.jpg",
    location: "family album",
    date: "2024-03-19",
    caption: "another quiet moment with mom",
    memory: "small frames like this carry so much comfort"
  },
  {
    id: "photo-3",
    src: "/images/family/we_4.jpg",
    location: "family album",
    date: "2023-11-02",
    caption: "all four of us in one frame",
    memory: "rare timing and everyone actually looking at the camera"
  },
  {
    id: "photo-4",
    src: "/images/family/we_4_dashain.jpg",
    location: "family album",
    date: "2024-10-18",
    caption: "family energy during dashain",
    memory: "the whole room felt brighter in this one"
  },
  {
    id: "photo-5",
    src: "/images/family/dashain.jpg",
    location: "festival",
    date: "2025-01-19",
    caption: "dashain colors and crowded smiles",
    memory: "a loud day in the best way"
  },
  {
    id: "photo-6",
    src: "/images/family/dashain1.jpg",
    location: "festival",
    date: "2025-01-19",
    caption: "dashain with the family all together",
    memory: null
  },
  {
    id: "photo-7",
    src: "/images/family/bro_sis.jpg",
    location: "family album",
    date: "2023-08-08",
    caption: "siblings and a little chaos",
    memory: "this feels like a summer memory in motion"
  },
  {
    id: "photo-8",
    src: "/images/family/bro_sis1.jpg",
    location: "family album",
    date: "2023-08-12",
    caption: "more sibling energy",
    memory: null
  },
  {
    id: "photo-9",
    src: "/images/family/with_grandparents.jpg",
    location: "family album",
    date: "2026-03-20",
    caption: "tea and stories with grandparents",
    memory: "I can hear their jokes when I see this"
  },
  {
    id: "photo-10",
    src: "/images/shreya/cute_selfie.jpg",
    location: "camera roll",
    date: "2022-07-04",
    caption: "a clean selfie with perfect light",
    memory: "one of those random shots that turned out too good"
  },
  {
    id: "photo-11",
    src: "/images/shreya/feeling_cute.jpg",
    location: "camera roll",
    date: "2024-04-11",
    caption: "feeling cute and unbothered",
    memory: null
  },
  {
    id: "photo-12",
    src: "/images/shreya/me.jpg",
    location: "camera roll",
    date: "2024-09-02",
    caption: "just me in a good moment",
    memory: "the kind of photo that feels honest"
  },
  {
    id: "photo-13",
    src: "/images/shreya/pro.jpg",
    location: "camera roll",
    date: "2025-01-08",
    caption: "a portrait moment with a little attitude",
    memory: null
  },
  {
    id: "photo-14",
    src: "/images/shreya/attitude.jpg",
    location: "camera roll",
    date: "2025-04-25",
    caption: "a little extra attitude",
    memory: "the expression says it all"
  },
  {
    id: "photo-15",
    src: "/images/shreya/cohed_school_dress.jpg",
    location: "camera roll",
    date: "2021-11-03",
    caption: "school dress and a familiar smile",
    memory: "nostalgia in one frame"
  },
  {
    id: "photo-16",
    src: "/images/shreya/cohed_school_dress1.jpg",
    location: "camera roll",
    date: "2021-11-03",
    caption: "another school-dress moment",
    memory: null
  },
  {
    id: "photo-17",
    src: "/images/shreya/lake_front.jpg",
    location: "travel",
    date: "2025-06-30",
    caption: "lake breeze and a calm afternoon",
    memory: "this one feels like a pause button"
  },
  {
    id: "photo-18",
    src: "/images/shreya/lake_back.jpg",
    location: "travel",
    date: "2025-06-30",
    caption: "back to the lake and the quiet light",
    memory: null
  },
  {
    id: "photo-19",
    src: "/images/shreya/in_bamboos.jpg",
    location: "travel",
    date: "2026-02-14",
    caption: "green everywhere and no signal on the phone",
    memory: null
  },
  {
    id: "photo-20",
    src: "/images/shreya/swinging_from_tree.jpg",
    location: "travel",
    date: "2026-05-07",
    caption: "swinging like it is still summer break",
    memory: null
  }
]

export function getPhotosByLocation(location) {
  return photos.filter((p) => p.location === location)
}
