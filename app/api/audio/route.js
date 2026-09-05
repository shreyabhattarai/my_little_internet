import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const AUDIO_ROOT = path.join(process.cwd(), "public", "audio")
const ALLOWED = new Set([".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"])

function toTitle(baseName) {
  return baseName
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

async function walkAudio(dirPath, relativePrefix = "") {
  const entries = await fs.readdir(dirPath, { withFileTypes: true })
  const tracks = []

  for (const entry of entries) {
    const abs = path.join(dirPath, entry.name)
    const rel = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name

    if (entry.isDirectory()) {
      const nested = await walkAudio(abs, rel)
      tracks.push(...nested)
      continue
    }

    const ext = path.extname(entry.name).toLowerCase()
    if (!ALLOWED.has(ext)) continue

    const folder = relativePrefix.split("/")[0] || "misc"
    tracks.push({
      id: rel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      title: toTitle(entry.name),
      src: `/audio/${rel}`,
      duration: "--:--",
      folder
    })
  }

  return tracks
}

export async function GET() {
  try {
    const allTracks = await walkAudio(AUDIO_ROOT)

    const grouped = new Map()
    for (const track of allTracks) {
      if (!grouped.has(track.folder)) {
        grouped.set(track.folder, [])
      }
      grouped.get(track.folder).push(track)
    }

    const playlists = [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([folder, tracks]) => ({
        id: folder.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: folder.replace(/[-_]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
        description: `tracks from audio/${folder}`,
        tracks
      }))

    return NextResponse.json({ playlists, allTracks })
  } catch (error) {
    return NextResponse.json(
      { playlists: [], allTracks: [], error: "unable to read audio library" },
      { status: 200 }
    )
  }
}
