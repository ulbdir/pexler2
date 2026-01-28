import { useCanvasStore } from '@/stores/canvasStore'
import { useHistoryStore } from '@/stores/historyStore'

export function useCanvasTransform() {
  const canvasStore = useCanvasStore()
  const historyStore = useHistoryStore()

  function flipHorizontal() {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < Math.floor(width / 2); x++) {
        const leftIdx = (y * width + x) * 4
        const rightIdx = (y * width + (width - 1 - x)) * 4

        for (let c = 0; c < 4; c++) {
          const temp = pixels[leftIdx + c]!
          pixels[leftIdx + c] = pixels[rightIdx + c]!
          pixels[rightIdx + c] = temp
        }
      }
    }

    canvasStore.bumpVersion()
  }

  function flipVertical() {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    for (let y = 0; y < Math.floor(height / 2); y++) {
      for (let x = 0; x < width; x++) {
        const topIdx = (y * width + x) * 4
        const bottomIdx = ((height - 1 - y) * width + x) * 4

        for (let c = 0; c < 4; c++) {
          const temp = pixels[topIdx + c]!
          pixels[topIdx + c] = pixels[bottomIdx + c]!
          pixels[bottomIdx + c] = temp
        }
      }
    }

    canvasStore.bumpVersion()
  }

  function rotate90() {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    const newWidth = height
    const newHeight = width
    const newPixels = new Uint8ClampedArray(newWidth * newHeight * 4)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4
        const newX = height - 1 - y
        const newY = x
        const dstIdx = (newY * newWidth + newX) * 4

        newPixels[dstIdx] = pixels[srcIdx]!
        newPixels[dstIdx + 1] = pixels[srcIdx + 1]!
        newPixels[dstIdx + 2] = pixels[srcIdx + 2]!
        newPixels[dstIdx + 3] = pixels[srcIdx + 3]!
      }
    }

    canvasStore.setImageData(newPixels, newWidth, newHeight)
  }

  function rotate180() {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    const newPixels = new Uint8ClampedArray(width * height * 4)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4
        const newX = width - 1 - x
        const newY = height - 1 - y
        const dstIdx = (newY * width + newX) * 4

        newPixels[dstIdx] = pixels[srcIdx]!
        newPixels[dstIdx + 1] = pixels[srcIdx + 1]!
        newPixels[dstIdx + 2] = pixels[srcIdx + 2]!
        newPixels[dstIdx + 3] = pixels[srcIdx + 3]!
      }
    }

    canvasStore.setImageData(newPixels, width, height)
  }

  function rotate270() {
    historyStore.pushState()

    const { width, height, pixels } = canvasStore
    const newWidth = height
    const newHeight = width
    const newPixels = new Uint8ClampedArray(newWidth * newHeight * 4)

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const srcIdx = (y * width + x) * 4
        const newX = y
        const newY = width - 1 - x
        const dstIdx = (newY * newWidth + newX) * 4

        newPixels[dstIdx] = pixels[srcIdx]!
        newPixels[dstIdx + 1] = pixels[srcIdx + 1]!
        newPixels[dstIdx + 2] = pixels[srcIdx + 2]!
        newPixels[dstIdx + 3] = pixels[srcIdx + 3]!
      }
    }

    canvasStore.setImageData(newPixels, newWidth, newHeight)
  }

  return {
    flipHorizontal,
    flipVertical,
    rotate90,
    rotate180,
    rotate270,
  }
}
