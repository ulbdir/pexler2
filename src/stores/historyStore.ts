import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCanvasStore } from '@/stores/canvasStore'

const MAX_HISTORY = 50

interface HistoryEntry {
  pixels: Uint8ClampedArray
  width: number
  height: number
}

export const useHistoryStore = defineStore('history', () => {
  const undoStack = ref<HistoryEntry[]>([])
  const redoStack = ref<HistoryEntry[]>([])

  function pushState() {
    const canvasStore = useCanvasStore()
    undoStack.value.push({
      pixels: canvasStore.getSnapshot(),
      width: canvasStore.width,
      height: canvasStore.height,
    })
    if (undoStack.value.length > MAX_HISTORY) {
      undoStack.value.shift()
    }
    redoStack.value = []
  }

  function undo() {
    const canvasStore = useCanvasStore()
    const state = undoStack.value.pop()
    if (state) {
      redoStack.value.push({
        pixels: canvasStore.getSnapshot(),
        width: canvasStore.width,
        height: canvasStore.height,
      })
      canvasStore.setImageData(state.pixels, state.width, state.height)
    }
  }

  function redo() {
    const canvasStore = useCanvasStore()
    const state = redoStack.value.pop()
    if (state) {
      undoStack.value.push({
        pixels: canvasStore.getSnapshot(),
        width: canvasStore.width,
        height: canvasStore.height,
      })
      canvasStore.setImageData(state.pixels, state.width, state.height)
    }
  }

  function clear() {
    undoStack.value = []
    redoStack.value = []
  }

  return { undoStack, redoStack, pushState, undo, redo, clear }
})
