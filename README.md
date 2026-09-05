# My Little Internet

A playful explorable personal website. Not a portfolio, a small
digital world built around one life.

## Getting started

```
npm install
npm run dev
```

Then open http://localhost:3000

To build for production

```
npm run build
npm start
```

## How to make it yours

All content lives in the lib folder, not in the components. Edit
these files to change what the site says without touching any UI
code.

- lib/worldConfig.js, the rooms, zones, object positions, movement
  speed, and the secret key sequence
- lib/mood.js, the current status snapshot shown in the top bar
- lib/photos.js, photo entries and captions, point src at real
  images in public/assets/images
- lib/music.js, playlists and tracks, point src at real audio files
  in public/assets/audio
- lib/feed.js, the short life feed entries
- lib/secrets.js, hidden content revealed through easter eggs
- lib/useless.js, pointless interaction responses and trash contents
- lib/computer.js, the fake desktop notes and internet links
- lib/rooms.js, bookshelf, wardrobe, bed, and arcade content
- lib/brainrot.js, the memes and nonsense area content

## Controls

- Arrow keys or w a s d to walk
- Click or tap anywhere to walk there, or tap an object to use it
  directly
- Enter or space to interact with whatever is nearby
- Try the up up down down left right left right sequence somewhere
  on the page
- Click the drawer a handful of times

## Accessibility

A text menu button sits in the bottom left corner. It opens every
room and object as a plain list, no character movement required.
The site respects the reduced motion system setting and all
interactive elements are reachable by keyboard.

## Notes on assets

The public/assets folder ships with a handful of placeholder SVG
photos and no real audio files. Drop real images and audio into the
matching subfolders and update the paths inside lib/photos.js and
lib/music.js.

## Stack

Next.js App Router, React, plain CSS Modules, and the native HTML5
Canvas API for the explorable room. No Tailwind, no game engine
dependency, everything is plain and easy to edit.
