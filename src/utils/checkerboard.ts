/**
 * Draw a checkerboard pattern on a canvas context.
 * Used for transparency backgrounds.
 */
export function drawCheckerboard(
  ctx: CanvasRenderingContext2D,
  options: {
    /** X offset to start drawing */
    x: number
    /** Y offset to start drawing */
    y: number
    /** Total width to cover */
    width: number
    /** Total height to cover */
    height: number
    /** Size of each checker square in screen pixels */
    checkerSize: number
    /** Light color (default: white) */
    lightColor?: string
    /** Dark color (default: light gray) */
    darkColor?: string
  }
): void {
  const {
    x,
    y,
    width,
    height,
    checkerSize,
    lightColor = '#ffffff',
    darkColor = '#e0e0e0',
  } = options

  const cols = Math.ceil(width / checkerSize)
  const rows = Math.ceil(height / checkerSize)

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const isLight = ((col + row) % 2) === 0
      ctx.fillStyle = isLight ? lightColor : darkColor

      const sx = x + col * checkerSize
      const sy = y + row * checkerSize
      // Clip to bounds
      const sw = Math.min(checkerSize, x + width - sx)
      const sh = Math.min(checkerSize, y + height - sy)

      ctx.fillRect(sx, sy, sw, sh)
    }
  }
}
