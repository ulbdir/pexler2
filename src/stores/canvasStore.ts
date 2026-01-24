import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RGBA } from '@/types'

export const useCanvasStore = defineStore('canvas', () => {
  const width = ref(32)
  const height = ref(32)
  const pixels = ref<Uint8ClampedArray>(new Uint8ClampedArray(32 * 32 * 4))
  const version = ref(0)

  function createNew(w: number, h: number) {
    width.value = w
    height.value = h
    pixels.value = new Uint8ClampedArray(w * h * 4)
    version.value++
  }

  function getPixel(x: number, y: number): RGBA {
    if (x < 0 || x >= width.value || y < 0 || y >= height.value) {
      return { r: 0, g: 0, b: 0, a: 0 }
    }
    const i = (y * width.value + x) * 4
    return {
      r: pixels.value[i]!,
      g: pixels.value[i + 1]!,
      b: pixels.value[i + 2]!,
      a: pixels.value[i + 3]!,
    }
  }

  function setPixel(x: number, y: number, color: RGBA) {
    if (x < 0 || x >= width.value || y < 0 || y >= height.value) return
    const i = (y * width.value + x) * 4
    pixels.value[i] = color.r
    pixels.value[i + 1] = color.g
    pixels.value[i + 2] = color.b
    pixels.value[i + 3] = color.a
  }

  function bumpVersion() {
    version.value++
  }

  function getSnapshot(): Uint8ClampedArray {
    return new Uint8ClampedArray(pixels.value)
  }

  function restoreSnapshot(snapshot: Uint8ClampedArray) {
    pixels.value = new Uint8ClampedArray(snapshot)
    version.value++
  }

  function setImageData(data: Uint8ClampedArray, w: number, h: number) {
    width.value = w
    height.value = h
    pixels.value = new Uint8ClampedArray(data)
    version.value++
  }

  return {
    width,
    height,
    pixels,
    version,
    createNew,
    getPixel,
    setPixel,
    bumpVersion,
    getSnapshot,
    restoreSnapshot,
    setImageData,
  }
})
