# My Little Internet

My Little Internet is a small interactive personal website built with Next.js.
It presents a browser based room where you can look around, click on things,
and find a few playful details along the way. It is meant to be a fun,
personal space, not a serious product.

## Overview

The room is drawn on an HTML canvas. A handful of zones in the room open
overlays or modals: an arcade with a few real mini games, a fake retro
computer desktop, a speaker that plays your own music, a window with a
day and night view, a photo frame, a bookshelf, and a desk with small
written updates. A few extra ideas (a bed, a wardrobe, a second internet
folder) exist in the code as unfinished future additions and are not
wired into the room yet.

## Features

- A navigable room scene with keyboard, mouse, and touch controls
- An arcade corner with reaction time, snake, memory, 2048, tic tac toe
  and a stacking game, each with local best scores
- A fake Windows style computer desktop with photos, notes, bookmarks
  and a trash folder
- A speaker that plays music straight from your own `public/audio`
  folders, picked up automatically, no code changes needed
- A window and a photo frame with their own focused camera views
- A bookshelf and a desk feed with small personal content
- A hidden key sequence easter egg
- Automatic fullscreen and music start on first interaction
- A rotate prompt for small portrait phones, the room needs about
  600px of width or height to draw comfortably

## Tech Stack

- Next.js 14
- React 18
- CSS Modules
- HTML5 Canvas

## Project Structure

- `app` the app entry, page, layout, 404 and error screens, and the
  `/api/audio` route that scans `public/audio`
- `components/room` the canvas room itself
- `components/arcade`, `components/computer`, `components/speaker` the
  three built out interactive pieces
- `components/bookshelf`, `components/desk`, `components/secret`,
  `components/popup` smaller content panels
- `components/shared` the shared modal and panel styles
- `components/future` unfinished ideas not currently reachable from
  the room, kept around for later
- `lib` room layout, zone definitions, and all editable content
- `public` images and audio, added separately, not part of this bundle

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

## Adding music

Drop audio files into folders under `public/audio`, one folder per
playlist, for example:

```
public/audio/lo-fi/track-1.mp3
public/audio/study/track-1.mp3
```

The `/api/audio` route scans this folder automatically on each
request, so playlists appear without touching any code. A folder
named `lo-fi` is used as the default ambient playlist if one exists,
otherwise the first playlist found is used. If `public/audio` is
empty, the speaker shows a "no tracks yet" state instead of an error.

## Customization

Most of the content is controlled through the library files:

- `lib/worldConfig.js` for room layout and interactive zones
- `lib/photos.js` for gallery entries and image sources
- `lib/feed.js` for the desk's personal updates
- `lib/mood.js` for the current status shown on the desk
- `lib/secrets.js` for hidden discoveries
- `lib/computer.js` for the fake desktop's notes and bookmarks
- `lib/rooms.js` for the bookshelf and arcade content

## Controls

- Move with arrow keys or W A S D
- Click or tap to look toward a location
- Click a zone to interact with it
- Explore the room for hidden interactions and secret sequences

## Notes

Image and audio assets are not included in this bundle. Add your own
files under `public` and the app will pick them up.

## License

This project is intended for personal or experimental use unless
otherwise specified by the repository owner.
