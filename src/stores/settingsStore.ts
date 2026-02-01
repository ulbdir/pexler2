import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const zoom = ref(8)
  const panX = ref(0)
  const panY = ref(0)
  const gridVisible = ref(true)
  const backgroundEnabled = ref(true)
  const checkerSize = ref(8)

  // Preview window state
  const previewVisible = ref(true)
  const previewZoom = ref<1 | 2 | 4>(1)
  const previewRepeatX = ref(false)
  const previewRepeatY = ref(false)
  const previewPosition = ref({ x: 100, y: 100 })
  const previewSize = ref({ width: 200, height: 200 })

  // Load preview state from localStorage (guard for test environment)
  const hasLocalStorage = typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
  if (hasLocalStorage) {
    const savedPreview = localStorage.getItem('pexler-preview')
    if (savedPreview) {
      try {
        const parsed = JSON.parse(savedPreview)
        if (typeof parsed.visible === 'boolean') previewVisible.value = parsed.visible
        if (parsed.zoom === 1 || parsed.zoom === 2 || parsed.zoom === 4) previewZoom.value = parsed.zoom
        if (typeof parsed.repeatX === 'boolean') previewRepeatX.value = parsed.repeatX
        if (typeof parsed.repeatY === 'boolean') previewRepeatY.value = parsed.repeatY
        if (typeof parsed.position?.x === 'number' && typeof parsed.position?.y === 'number') {
          previewPosition.value = { x: parsed.position.x, y: parsed.position.y }
        }
        if (typeof parsed.size?.width === 'number' && typeof parsed.size?.height === 'number') {
          previewSize.value = { width: parsed.size.width, height: parsed.size.height }
        }
      } catch {
        // Ignore invalid JSON
      }
    }

    // Persist preview state to localStorage
    watch(
      [previewVisible, previewZoom, previewRepeatX, previewRepeatY, previewPosition, previewSize],
      () => {
        localStorage.setItem('pexler-preview', JSON.stringify({
          visible: previewVisible.value,
          zoom: previewZoom.value,
          repeatX: previewRepeatX.value,
          repeatY: previewRepeatY.value,
          position: previewPosition.value,
          size: previewSize.value,
        }))
      },
      { deep: true }
    )
  }

  function resetView(canvasWidth: number, canvasHeight: number, containerWidth: number, containerHeight: number) {
    const fitZoom = Math.min(
      containerWidth / canvasWidth,
      containerHeight / canvasHeight
    ) * 0.8
    zoom.value = Math.max(1, Math.min(64, Math.round(fitZoom)))
    panX.value = (containerWidth - canvasWidth * zoom.value) / 2
    panY.value = (containerHeight - canvasHeight * zoom.value) / 2
  }

  function togglePreview() {
    previewVisible.value = !previewVisible.value
  }

  return {
    zoom,
    panX,
    panY,
    gridVisible,
    backgroundEnabled,
    checkerSize,
    resetView,
    // Preview window
    previewVisible,
    previewZoom,
    previewRepeatX,
    previewRepeatY,
    previewPosition,
    previewSize,
    togglePreview,
  }
})
