import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RGBA } from '@/types'

const DEFAULT_PALETTE: RGBA[] = [
  // Row 1: Dark browns and warm tones
  { r: 101, g: 46, b: 31, a: 255 },
  { r: 139, g: 69, b: 19, a: 255 },
  { r: 160, g: 82, b: 45, a: 255 },
  { r: 184, g: 115, b: 51, a: 255 },
  { r: 210, g: 150, b: 75, a: 255 },
  { r: 244, g: 196, b: 48, a: 255 },
  // Row 2: Reds and oranges
  { r: 139, g: 0, b: 0, a: 255 },
  { r: 178, g: 34, b: 34, a: 255 },
  { r: 220, g: 60, b: 60, a: 255 },
  { r: 255, g: 99, b: 71, a: 255 },
  { r: 255, g: 140, b: 0, a: 255 },
  { r: 255, g: 195, b: 0, a: 255 },
  // Row 3: Yellows and greens
  { r: 255, g: 223, b: 0, a: 255 },
  { r: 240, g: 230, b: 140, a: 255 },
  { r: 154, g: 205, b: 50, a: 255 },
  { r: 34, g: 139, b: 34, a: 255 },
  { r: 0, g: 100, b: 0, a: 255 },
  { r: 85, g: 107, b: 47, a: 255 },
  // Row 4: Teals and blues
  { r: 0, g: 128, b: 128, a: 255 },
  { r: 64, g: 224, b: 208, a: 255 },
  { r: 0, g: 191, b: 255, a: 255 },
  { r: 30, g: 144, b: 255, a: 255 },
  { r: 0, g: 0, b: 205, a: 255 },
  { r: 25, g: 25, b: 112, a: 255 },
  // Row 5: Purples and pinks
  { r: 75, g: 0, b: 130, a: 255 },
  { r: 138, g: 43, b: 226, a: 255 },
  { r: 186, g: 85, b: 211, a: 255 },
  { r: 255, g: 20, b: 147, a: 255 },
  { r: 255, g: 105, b: 180, a: 255 },
  { r: 255, g: 182, b: 193, a: 255 },
  // Row 6: Grays and B&W
  { r: 0, g: 0, b: 0, a: 255 },
  { r: 64, g: 64, b: 64, a: 255 },
  { r: 128, g: 128, b: 128, a: 255 },
  { r: 192, g: 192, b: 192, a: 255 },
  { r: 224, g: 224, b: 224, a: 255 },
  { r: 255, g: 255, b: 255, a: 255 },
]

export const usePaletteStore = defineStore('palette', () => {
  const colors = ref<RGBA[]>([...DEFAULT_PALETTE])
  const selectedColor = ref<RGBA>({ r: 0, g: 0, b: 0, a: 255 })
  const autoAdd = ref(false)

  function addColor(color: RGBA) {
    const exists = colors.value.some(
      c => c.r === color.r && c.g === color.g && c.b === color.b && c.a === color.a
    )
    if (!exists) {
      colors.value.push({ ...color })
    }
  }

  function removeColor(index: number) {
    colors.value.splice(index, 1)
  }

  function clearPalette() {
    colors.value = []
  }

  function resetPalette() {
    colors.value = [...DEFAULT_PALETTE]
  }

  function extractFromImage(pixels: Uint8ClampedArray, width: number, height: number) {
    const seen = new Set<string>()
    for (let i = 0; i < width * height * 4; i += 4) {
      const r = pixels[i]!
      const g = pixels[i + 1]!
      const b = pixels[i + 2]!
      const a = pixels[i + 3]!
      if (a === 0) continue
      const key = `${r},${g},${b},${a}`
      if (!seen.has(key)) {
        seen.add(key)
        addColor({ r, g, b, a })
      }
    }
  }

  return {
    colors,
    selectedColor,
    autoAdd,
    addColor,
    removeColor,
    clearPalette,
    resetPalette,
    extractFromImage,
  }
})
