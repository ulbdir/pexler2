# Features

## Implemented

### Drawing Tools
- **Pencil** (`P`) — Single-pixel drawing with Bresenham line interpolation
- **Eraser** (`E`) — Clear pixels to transparent
- **Flood Fill** (`G`) — Stack-based 4-directional fill
- **Eyedropper** (`I`) — Pick color from canvas
- **Shape tool** (`S`) — Line, Rectangle, Ellipse with outline/filled toggle and square/circle constraints

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

---

## Upcoming

Features prioritized by usefulness, development effort, and integration fit (scored 1–5 each, max 15).

### High Priority (Score 13–14)

| Feature | U | D | I | Total | Description |
|---------|---|---|---|-------|-------------|
| Line & Shape Tools | 5 | 4 | 5 | 14 | ✅ **COMPLETED**: Line, rectangle, ellipse with outline/filled toggle and square/circle constraints. Two-click interaction with live preview. |
| Mirror / Symmetry Drawing | 5 | 4 | 5 | 14 | Horizontal/vertical axis symmetry while drawing. Duplicate setPixel with reflected coords. |
| Brush Size | 4 | 4 | 5 | 13 | Variable 1–16px brush with square/circle shapes. |
| Pixel-Perfect Mode | 4 | 4 | 5 | 13 | Removes L-shaped double pixels when drawing freehand. Keeps lines clean. |
| Scaled Export | 4 | 4 | 5 | 13 | Export at 2x/4x/8x scale with nearest-neighbor interpolation. |

### Medium Priority (Score 10–12)

| Feature | U | D | I | Total | Description |
|---------|---|---|---|-------|-------------|
| Rectangular Selection + Move | 5 | 3 | 4 | 12 | Marching ants selection, move/copy/paste, delete selection. |
| Dithering Patterns | 4 | 4 | 4 | 12 | Checkerboard / Bayer matrix brush modes for pixel art gradients. |
| Layers | 5 | 2 | 3 | 10 | Multiple transparent layers with visibility, opacity, reorder. Strategic investment for future features. |

### Future Considerations

| Feature | U | D | I | Total | Notes |
|---------|---|---|---|-------|-------|
| Lospec Palette Integration | 3 | 4 | 5 | 12 | Fetch community palettes from lospec.com API. |
| Tiled/Wrap Mode | 3 | 3 | 4 | 10 | Render canvas tiled for seamless texture creation. |
| Custom Brushes | 3 | 3 | 3 | 9 | Select region and use as stamp. Depends on selection tool. |
| Animation / Frames | 5 | 1 | 2 | 8 | Major architectural change. Best done after layers. |
| Onion Skinning | 4 | 2 | 3 | 9 | Depends on animation/frames existing first. |

---

## Scoring Legend

- **U (Usefulness)**: 5=Transformative, 4=Major improvement, 3=Nice to have
- **D (Dev Effort)**: 5=Very easy, 4=Straightforward, 3=Moderate (inverted complexity)
- **I (Integration)**: 5=Perfect fit, 4=Minor adjustments, 3=Some restructuring
