import type { RGBA } from '@/types'

export function rgbaToHex(color: RGBA): string {
  const r = color.r.toString(16).padStart(2, '0')
  const g = color.g.toString(16).padStart(2, '0')
  const b = color.b.toString(16).padStart(2, '0')
  return `#${r}${g}${b}`
}

export function hexToRgba(hex: string): RGBA {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { r: 0, g: 0, b: 0, a: 255 }
  return {
    r: parseInt(result[1]!, 16),
    g: parseInt(result[2]!, 16),
    b: parseInt(result[3]!, 16),
    a: 255,
  }
}

export function rgbaToCss(color: RGBA): string {
  if (color.a === 255) {
    return rgbaToHex(color)
  }
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${(color.a / 255).toFixed(2)})`
}
