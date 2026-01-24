import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const zoom = ref(8)
  const panX = ref(0)
  const panY = ref(0)
  const gridVisible = ref(true)
  const backgroundEnabled = ref(true)
  const checkerSize = ref(8)

  function resetView(canvasWidth: number, canvasHeight: number, containerWidth: number, containerHeight: number) {
    const fitZoom = Math.min(
      containerWidth / canvasWidth,
      containerHeight / canvasHeight
    ) * 0.8
    zoom.value = Math.max(1, Math.min(64, Math.round(fitZoom)))
    panX.value = (containerWidth - canvasWidth * zoom.value) / 2
    panY.value = (containerHeight - canvasHeight * zoom.value) / 2
  }

  return {
    zoom,
    panX,
    panY,
    gridVisible,
    backgroundEnabled,
    checkerSize,
    resetView,
  }
})
