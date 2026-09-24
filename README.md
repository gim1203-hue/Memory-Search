# Memory Search

Memory Search is a responsive personal-life dashboard for saving and finding notes, photos, videos, and voice memos. It runs entirely in the browser, so personal data is not uploaded to GitHub.

## Live app

https://gim1203-hue.github.io/Memory-Search/

## Features

- Create categorized text memories
- Add photos and videos from a device
- Record voice memos with browser microphone permission
- Persist notes in `localStorage` and media blobs in IndexedDB
- Search by title, description, category, date, or time
- Calendar, timeline, and favorites views
- Delete memories, clear browser data, and export metadata
- Light/dark themes and responsive navigation
- Automatic deployment to GitHub Pages

## Run locally

Requires Node.js 22 or newer and npm.

```bash
npm install
npm run dev
```

Open the local address shown by Vite, normally `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm run build
npm run preview
```

## Project structure

```text
memory-search/
├── .github/workflows/deploy-pages.yml  # GitHub Pages automation
├── public/                             # Static icons
├── src/
│   ├── components/                     # Shared UI components
│   ├── pages/                          # Dashboard and routed pages
│   ├── services/mediaDB.js             # IndexedDB media storage
│   ├── App.jsx                         # State, persistence, and routes
│   ├── App.css                         # Application styling
│   ├── firebaseConfig.js               # Reserved Firebase configuration
│   └── main.jsx                        # React entry point and HashRouter
├── index.html
├── package.json
└── vite.config.js                      # GitHub Pages base path
```

## How storage works

Text metadata is stored in `localStorage`. Photo, video, and audio blobs are stored in the browser's IndexedDB database named `memory-search-db`. The memory ID connects each metadata record to its media file.

Data is local to one browser profile and device. Clearing browser site data removes it. This version does not synchronize memories through Firebase.

## Deploy and update

```bash
git add .
git commit -m "Describe the update"
git push origin main
```

The workflow in `.github/workflows/deploy-pages.yml` automatically publishes changes from `main`. Deployment progress appears in the repository's **Actions** tab.

## Manual testing checklist

- Add a note and refresh; confirm it remains.
- Add a photo/video and refresh; confirm it remains playable.
- Record a voice memo, refresh, and replay it.
- Search using a title, category, and date.
- Add and remove a favorite.
- Navigate every page at desktop and mobile widths.
- Switch themes and refresh.
- Delete one memory and verify it stays deleted.
- Export metadata and clear all memories from Settings.

## Privacy and limitations

- Memories remain on the device; they are not stored in GitHub.
- Export includes metadata, not binary media files.
- Microphone recording requires browser permission and HTTPS.
- Browser storage quotas limit the amount of media that can be saved.

## Portfolio description

Built a responsive React personal-memory dashboard with reusable components, client-side routing, localStorage and IndexedDB persistence, media capture, search, filtering, dark mode, accessible controls, and automated GitHub Pages deployment.
