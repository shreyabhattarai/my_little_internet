// Photo entries
// Drop real images into public assets images and update src below
// Each photo can live in a different location inside the world

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
    src: "/images/family/we_4.jpg",
    location: "family album",
    date: "2023-11-02",
    caption: "all four of us in one frame",
    memory: "rare timing and everyone actually looking at the camera"
  },
  {
    id: "photo-3",
    src: "/images/family/dashain.jpg",
    location: "festival",
    date: "2025-01-19",
    caption: "dashain colors and crowded smiles",
    memory: "a loud day in the best way"
  },
  {
    id: "photo-4",
    src: "/images/shreya/cute_selfie.jpg",
    location: "camera roll",
    date: "2022-07-04",
    caption: "a clean selfie with perfect light",
    memory: "one of those random shots that turned out too good"
  },
  {
    id: "photo-5",
    src: "/images/shreya/lake_front.jpg",
    location: "travel",
    date: "2025-06-30",
    caption: "lake breeze and a calm afternoon",
    memory: "this one feels like a pause button"
  },
  {
    id: "photo-6",
    src: "/images/shreya/in_bamboos.jpg",
    location: "travel",
    date: "2026-02-14",
    caption: "green everywhere and no signal on the phone",
    memory: null
  },
  {
    id: "photo-7",
    src: "/images/family/with_grandparents.jpg",
    location: "family album",
    date: "2026-03-20",
    caption: "tea and stories with grandparents",
    memory: "I can hear their jokes when I see this"
  },
  {
    id: "photo-8",
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
