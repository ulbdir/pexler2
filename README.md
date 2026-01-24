# Pexler

A browser-based pixel art editor. Draw, fill, pick colors, and export your creations as PNG — all in the browser.

**Try it live:** https://ulbdir.github.io/pexler2/

## Features

- **Drawing Tools** — Pencil, Eraser, Flood Fill, Eyedropper
- **Canvas** — Zoom (1x–64x), pan, resizable (1–512px), pixel grid overlay
- **Colors** — 36-color default palette, full RGBA color picker, save/load palettes as JSON
- **History** — Undo/Redo (up to 50 states)
- **Import/Export** — Export as PNG, load any image file
- **i18n** — English and German (auto-detected)

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Pencil | `P` |
| Eraser | `E` |
| Fill | `G` |
| Eyedropper | `I` |
| Zoom In | `+` / scroll up |
| Zoom Out | `-` / scroll down |
| Pan | Right-click drag / Ctrl+drag |
| Undo | `Ctrl+Z` |
| Redo | `Ctrl+Shift+Z` / `Ctrl+Y` |

## Tech Stack

| | |
|---|---|
| Framework | Vue 3 + TypeScript |
| Build | Vite 7 |
| State | Pinia |
| Styling | Tailwind CSS v4 |
| UI | Radix Vue, Lucide icons |
| Color Picker | @simonwep/pickr |
| Testing | Vitest + Vue Test Utils |

## Getting Started

### Prerequisites

- Node.js 20+

### Install & Run

```bash
npm install
npm run dev
```

### Other Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint + TypeScript check |
| `npm run test` | Run all tests |
| `npm run test:watch` | Tests in watch mode |

## Project Structure

```
src/
├── components/       # Vue components (canvas, tools, palette, dialogs)
├── composables/      # Reusable logic (renderer, interaction, drawing, I/O)
├── stores/           # Pinia stores (canvas, history, palette, settings, tool)
├── utils/            # Algorithms (flood fill, bresenham, color conversion)
├── i18n/             # Translations (en, de)
├── types/            # TypeScript type definitions
└── App.vue           # Root layout
```

## Deployment

Pushes to `main` automatically deploy to GitHub Pages via GitHub Actions.
The workflow runs lint, tests, and build before deploying.
