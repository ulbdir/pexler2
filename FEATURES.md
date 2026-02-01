# Features

## Implemented

### Drawing Tools
- **Pencil** (`P`) — Single-pixel drawing with Bresenham line interpolation
- **Eraser** (`E`) — Clear pixels to transparent
- **Flood Fill** (`G`) — Stack-based 4-directional fill
- **Eyedropper** (`I`) — Pick color from canvas
- **Shape tool** (`S`) — Line, Rectangle, Ellipse with outline/filled toggle and square/circle constraints
- **Mirror / Symmetry Drawing** — Horizontal/vertical axis symmetry while drawing with live preview
- **Blend Mode** (`B`) — Overwrite or blend mode for Pencil and Shape tools. Blend applies color with transparency over existing pixels using alpha blending

### Canvas & View
- Configurable canvas size (1–512px, presets: 16x16, 32x32, 64x64, 128x128)
- Zoom in/out (1x–64x), cursor-centered wheel zoom
- Pan via right-click drag or Ctrl+drag
- Pixel grid overlay (auto-shown at zoom >= 4x)
- Checkerboard transparency background (configurable: 4/8/16/32px)

### Color & Palette
- 36-color default palette
- Add/remove individual colors
- Auto-add colors while drawing
- Extract palette from current image
- Save/load palette as JSON
- Clear/reset palette
- Color Picker Dialog with transparency (HSV/HSL/HEX)


### File I/O
- Export as PNG
- Load image (any browser-supported format)

### History
- Undo/Redo (up to 50 states)

### Canvas Transforms
- Flip horizontal/vertical
- Rotate 90°/180°/270° clockwise

### UI & Settings
- Keyboard shortcuts for all tools and zoom
- i18n support (English + German, auto-detected)
- Grid toggle, checker background settings

### Keyboard Shortcuts
- `S` — Select Shape tool
- `F` — Toggle outline/filled (when shape tool active)
- `Q` — Toggle square/circle constraint (when rectangle/ellipse shape active)
- `1`/`2`/`3` — Select Line/Rectangle/Ellipse (when shape tool active)
- `B` — Toggle blend mode overwrite/blend (when pencil/shape active)

---

## Upcoming

Features prioritized by usefulness, development effort, and integration fit (scored 1–5 each, max 15).

### Critical Priority (Score 14–15)

| Feature | U | D | I | Total | Description |
|---------|---|---|---|-------|-------------|
| Brush Size | 5 | 5 | 5 | 15 | Variable 1–16px brush with square/circle shapes. Essential for any serious workflow. |
| Rectangular Selection + Move | 5 | 4 | 5 | 14 | Marching ants selection, drag to move, copy/paste, delete. Foundation for many other features. |
| Pixel-Perfect Mode | 4 | 5 | 5 | 14 | Removes L-shaped double pixels when drawing freehand. Keeps lines automatically clean. |

### High Priority (Score 12–13)

| Feature | U | D | I | Total | Description |
|---------|---|---|---|-------|-------------|
| Scaled Export | 4 | 5 | 4 | 13 | Export at 2x/4x/8x/16x scale with nearest-neighbor interpolation. Critical for sharing pixel art. |
| Color Replace Tool | 4 | 5 | 4 | 13 | Replace one color with another across entire canvas. Essential for palette swapping. |
| Magic Wand Selection | 4 | 4 | 4 | 12 | Select contiguous same-color regions with tolerance. Fast selection of shapes/objects. |
| Shading Mode | 4 | 4 | 4 | 12 | Cycle through palette colors when drawing over existing pixels. Creates smooth gradients. |

### Medium Priority (Score 10–11)

| Feature | U | D | I | Total | Description |
|---------|---|---|---|-------|-------------|
| Dithering Patterns | 4 | 4 | 3 | 11 | Checkerboard / Bayer matrix brush modes for creating gradients in limited palettes. |
| Lospec Palette Integration | 3 | 4 | 4 | 11 | Browse and import from 4100+ community palettes directly from lospec.com API. |
| Tiled/Wrap Mode | 3 | 4 | 4 | 11 | Render canvas tiled 3x3 for seamless texture creation. See pattern repeat instantly. |
| Layers | 5 | 2 | 3 | 10 | Multiple transparent layers with visibility, opacity, reorder. Strategic for future animation. |

### Future Considerations

| Feature | U | D | I | Total | Notes |
|---------|---|---|---|-------|-------|
| Custom Brushes | 3 | 3 | 3 | 9 | Select region and use as stamp. Depends on selection tool implementation. |
| Onion Skinning | 4 | 2 | 3 | 9 | Preview previous/next frames. Depends on animation/frames existing first. |
| Animation / Frames | 5 | 1 | 2 | 8 | Multi-frame timeline with playback. Major architectural change. Best done after layers. |

---

## Scoring Legend

- **U (Usefulness)**: 5=Transformative, 4=Major improvement, 3=Nice to have
- **D (Dev Effort)**: 5=Very easy, 4=Straightforward, 3=Moderate (inverted complexity)
- **I (Integration)**: 5=Perfect fit, 4=Minor adjustments, 3=Some restructuring
