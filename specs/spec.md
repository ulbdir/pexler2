# Pexler - Requirements Specification

## General
- Single page application, no backend
- Retro/pixel art visual style
- Tech stack: Vite, Vue 3, TypeScript, shadcn-vue, Tailwind CSS, Pinia
- supported browsers at least chrome, safari and firefox

## Code Quality
- respect coding best practises
- apply clean code principles (single responsibility, separation of concerns, etc)
- follow ux and ui best practises
- set up unit tests were appropriate and e2e tests for critical user flows

## Visual Design
- Warm beige/cream color scheme (#F5E6C8 range)
- Pixel font for headings (Press Start 2P)
- See `specs/ui-design.png` for visual reference

## Layout
- **Header**: App title "Pexler" + dropdown menus + settings
- **Left sidebar**: Tools panel
- **Right sidebar**: Color palette and selected color
- **Main area**: Pixel canvas centered on beige background

## Header Menus
- "Bild" (Image) dropdown:
  - New canvas (with size selection)
  - Load Image
  - Save Image (Download)
- "Farbpalette" (Color palette) dropdown:
  - Load palettes
  - Save palette
  - Clear Palette
  - Get from Image
  - Auto-add colors from drawing tool
- Settings
  - grid visibility toggle
    - if enabled, draws a grid around every pixel on the canvas
  - canvas background toggle
    - if enabled, draws a checkerboard with the specified checker size as background on the canvas
  - canvas background config:
    - 4px, 8px, 16px, 32px

## Tools ("Werkzeuge")
- Pencil: Draw single pixels
- Eraser: Remove pixels (set to transparent)
- Fill bucket: Flood fill area with selected color
- Eyedropper: Pick color from canvas
- more tools will be added later

## Color Palette ("Farbpalette")
- color swatches for palette colors, layed out in a grid
- Selected color indicator, opens color picker on click
- Default palette with warm/retro tones

## Canvas
- fills the main area
- shows a zoomed view of the image, supports large zoom levels where every pixel of the image appears huge on the canvas
- no anti-aliasing, crisp zoomed rendering
- mouse-wheel and pinch to zoom gestures to zoom the view of the image, needs to work both with mouse or on tablet/laptops without mouse
- rioght-click or ctrl-click to pan the view of the image
- Grid line overlay (toggleable)
- small buttons in the bottom right center to reset the view, zoom in/out, toggle grid

## History
- Undo (Ctrl+Z)
- Redo (Ctrl+Y)

## Keyboard Shortcuts
- P: Pencil tool
- E: Eraser tool
- G: Fill tool
- I: Eyedropper tool
- +/-: Zoom in/out

## Export
- PNG export with 1:1 pixel resolution
- Crisp pixel rendering (no anti-aliasing)
