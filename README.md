# My Little Internet

My Little Internet is a small interactive personal website built with Next.js. It presents a browser-based room or digital home where users can explore objects, trigger playful interactions, browse fake desktop content, and discover hidden details.

## Overview

This project is designed as an expressive, self-contained digital space rather than a conventional portfolio. It combines a canvas-based room layout, modal content panels, ambient UI, and a few hidden easter eggs.

## Features

- A navigable room scene with keyboard and pointer controls
- Interactive zones for music, photos, desk content, books, and arcade-like moments
- Desktop style panels and overlays for simulated browsing and personal content
- Customizable content driven by the files in the lib directory
- Responsive UI and accessibility-friendly navigation patterns
- A lightweight Next.js app with plain CSS modules and no heavy game engine

## Tech Stack

- Next.js 14
- React 18
- CSS Modules
- HTML5 Canvas

## Project Structure

- app contains the app entry and page layout
- components contains reusable UI and modal components
- lib contains world data, content, and behavior definitions
- public contains images, audio, and static assets

## Getting Started

Install dependencies:

```bash
npm install
```

Run the app in development mode:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Production Build

```bash
npm run build
npm start
```

## Customization

Most of the app content is controlled through the library files, especially:

- lib/worldConfig.js for room layout and interactive zones
- lib/music.js for playlists and audio references
- lib/photos.js for gallery entries and image sources
- lib/feed.js for personal updates and notes
- lib/secrets.js for hidden discoveries
- lib/computer.js for fake desktop content and links
- lib/rooms.js for the room composition and content blocks

Update these files to personalize the experience without changing the core app structure.

## Controls

- Move with arrow keys or W A S D
- Click or tap to navigate to a location
- Press Enter or Space to interact with nearby items
- Explore the room for hidden interactions and secret sequences

## Notes

The project includes placeholder assets in public. Replace these files with your own media and update the corresponding source paths in the lib files to make the experience match your own content.

## License

This project is intended for personal or experimental use unless otherwise specified by the repository owner.