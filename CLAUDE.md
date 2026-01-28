# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pexler is a single-page pixel art editor (no backend). Visual reference: `specs/ui-design.png`. Full requirements: `specs/spec.md`.

## Tech Stack

- **Build**: Vite 7
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript (strict)
- **UI Primitives**: Radix Vue
- **Icons**: Lucide Vue Next
- **Styling**: Tailwind CSS v4
- **State Management**: Pinia
- **Testing**: Vitest + Vue Test Utils (jsdom)
- **Browsers**: Chrome, Safari, Firefox

## Build & Dev Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Type-check (vue-tsc) + production build
npm run preview      # Preview production build
npm run lint         # ESLint + type-check (vue-tsc --noEmit)
npm run test         # Run unit tests once (Vitest)
npm run test:watch   # Run unit tests in watch mode
```

## Architecture

### Layout

Four-zone fixed layout (defined in `App.vue`):
- **Header** (`AppHeader`): App title + dropdown menus (Bild, Farbpalette, Settings)
- **Left sidebar** (`ToolSidebar`): Tool selection (Pencil, Eraser, Fill, Eyedropper)
- **Right sidebar** (`PaletteSidebar`): Color palette grid + selected color indicator
- **Main area** (`CanvasArea`): Pixel canvas with zoom/pan, grid overlay, and canvas controls

### Source Structure

```
src/
├── components/
│   ├── canvas/        # PixelCanvas, CanvasControls
│   ├── dialogs/       # NewCanvasDialog
│   ├── header/        # BildMenu, FarbpaletteMenu, SettingsButton
│   ├── layout/        # AppHeader, ToolSidebar, PaletteSidebar, CanvasArea
│   ├── palette/       # PalettePanel, SelectedColor, ColorSwatch
│   └── tools/         # ToolPanel, ToolButton
├── composables/
│   ├── useCanvasInteraction.ts  # Zoom/pan (wheel, right-click drag)
│   ├── useCanvasRenderer.ts     # OffscreenCanvas rendering + grid/checkerboard
│   ├── useDrawingTools.ts       # Tool logic (pencil, eraser, fill, eyedropper)
│   ├── useImageIO.ts            # PNG export, image/palette load/save
│   └── useKeyboardShortcuts.ts  # Keyboard bindings
├── stores/
│   ├── canvasStore.ts     # Pixel data (Uint8ClampedArray RGBA), dimensions
│   ├── historyStore.ts    # Undo/redo stack (max 50 states)
│   ├── paletteStore.ts    # Colors, selectedColor, auto-add
│   ├── settingsStore.ts   # Zoom (1-64), pan, grid, checkerboard
│   └── toolStore.ts       # Active tool selection
├── types/
│   └── index.ts           # RGBA, Point, ToolType
├── utils/
│   ├── bresenham.ts       # Line drawing algorithm
│   ├── colorUtils.ts      # RGBA↔hex↔CSS conversions
│   └── floodFill.ts       # Stack-based 4-directional flood fill
├── lib/
│   └── utils.ts           # cn() (clsx + tailwind-merge)
├── App.vue
├── app.css                # Tailwind config, beige theme, pixel font
└── main.ts
```

### Key Patterns

- **Pixel data**: `Uint8ClampedArray` in RGBA format, manipulated directly for performance
- **Rendering**: OffscreenCanvas with `imageSmoothingEnabled: false` for crisp pixels
- **Drawing**: Bresenham line interpolation between pointer events, history push before each stroke
- **Reactivity**: Canvas store uses a `version` counter to trigger re-renders
- **Tools**: Pointer Events API for unified mouse/touch handling

## Design System

- Custom beige palette (`beige-50` #FFF8EC to `beige-900` #3A3018) defined in `app.css`
- Pixel font: "Press Start 2P" (loaded from Google Fonts in `index.html`)
- Retro/pixel art aesthetic throughout UI
- UI language: German (menu labels, dialog text)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| P | Pencil |
| E | Eraser |
| G | Fill |
| I | Eyedropper |
| + / = | Zoom in |
| - | Zoom out |
| Ctrl/Cmd+Z | Undo |
| Ctrl/Cmd+Shift+Z | Redo |
| Ctrl/Cmd+Y | Redo |

## Tests

Unit tests live alongside source files:

`src/utils/`:
- `bresenham.test.ts` — line rasterization (directions, slopes, single point)
- `colorUtils.test.ts` — RGBA/hex/CSS conversions and edge cases
- `floodFill.test.ts` — flood fill correctness, boundaries, transparency

`src/stores/`:
- `canvasStore.test.ts` — pixel access, bounds checking, snapshots
- `historyStore.test.ts` — undo/redo state machine, stack overflow
- `paletteStore.test.ts` — color add/remove/dedup, image extraction
- `settingsStore.test.ts` — resetView zoom/pan calculations

## Feature Tracking

`features.md` tracks implemented and upcoming features. When implementing a new feature:
1. Add it to the appropriate "Implemented" subsection
2. Remove it from the "Upcoming" table if it was listed there
