import { type Ref } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useCanvasStore } from '@/stores/canvasStore'
import type { Point } from '@/types'

export function screenToImage(
  canvasEl: HTMLCanvasElement | null,
  clientX: number,
  clientY: number
): Point | null {
  if (!canvasEl) return null

  const settings = useSettingsStore()
  const canvasStore = useCanvasStore()
  const rect = canvasEl.getBoundingClientRect()
  const x = clientX - rect.left
  const y = clientY - rect.top

  const imgX = Math.floor((x - settings.panX) / settings.zoom)
  const imgY = Math.floor((y - settings.panY) / settings.zoom)

  if (imgX < 0 || imgX >= canvasStore.width || imgY < 0 || imgY >= canvasStore.height) {
    return null
  }

  return { x: imgX, y: imgY }
}

export function useCanvasInteraction(canvasRef: Ref<HTMLCanvasElement | null>) {
  const settings = useSettingsStore()

  let isPanning = false
  let lastPanX = 0
  let lastPanY = 0

  function onPointerDown(e: PointerEvent) {
    if (e.button === 2 || (e.button === 0 && e.ctrlKey)) {
      isPanning = true
      lastPanX = e.clientX
      lastPanY = e.clientY
      canvasRef.value?.setPointerCapture(e.pointerId)
      e.preventDefault()
    }
  }

  function onPointerMove(e: PointerEvent) {
    if (isPanning) {
      const dx = e.clientX - lastPanX
      const dy = e.clientY - lastPanY
      settings.panX += dx
      settings.panY += dy
      lastPanX = e.clientX
      lastPanY = e.clientY
      e.preventDefault()
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (isPanning) {
      isPanning = false
      canvasRef.value?.releasePointerCapture(e.pointerId)
    }
  }

  function onPointerCancel(e: PointerEvent) {
    if (isPanning) {
      isPanning = false
      canvasRef.value?.releasePointerCapture(e.pointerId)
    }
  }

  function onWheel(e: WheelEvent) {
    e.preventDefault()

    const canvas = canvasRef.value
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const cursorX = e.clientX - rect.left
    const cursorY = e.clientY - rect.top

    const oldZoom = settings.zoom
    const factor = e.deltaY < 0 ? 1.2 : 1 / 1.2
    let newZoom = Math.round(oldZoom * factor)

    newZoom = Math.max(1, Math.min(64, newZoom))
    if (newZoom === oldZoom) {
      newZoom = e.deltaY < 0 ? oldZoom + 1 : oldZoom - 1
      newZoom = Math.max(1, Math.min(64, newZoom))
    }

    settings.panX = cursorX - (cursorX - settings.panX) * (newZoom / oldZoom)
    settings.panY = cursorY - (cursorY - settings.panY) * (newZoom / oldZoom)
    settings.zoom = newZoom
  }

  function onContextMenu(e: Event) {
    e.preventDefault()
  }

  function attach() {
    const canvas = canvasRef.value
    if (!canvas) return

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerCancel)
    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('contextmenu', onContextMenu)
  }

  function detach() {
    const canvas = canvasRef.value
    if (!canvas) return

    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerCancel)
    canvas.removeEventListener('wheel', onWheel)
    canvas.removeEventListener('contextmenu', onContextMenu)
  }

  return { attach, detach }
}
