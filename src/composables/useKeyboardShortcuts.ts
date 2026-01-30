import { onMounted, onUnmounted } from 'vue'
import { useToolStore } from '@/stores/toolStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useHistoryStore } from '@/stores/historyStore'

export function useKeyboardShortcuts() {
  const toolStore = useToolStore()
  const settings = useSettingsStore()
  const historyStore = useHistoryStore()

  function onKeyDown(e: KeyboardEvent) {
    const tag = (e.target as HTMLElement).tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        historyStore.redo()
        return
      }
      if (e.key === 'z') {
        e.preventDefault()
        historyStore.undo()
        return
      }
      if (e.key === 'y') {
        e.preventDefault()
        historyStore.redo()
        return
      }
    }

    switch (e.key.toLowerCase()) {
      case 'p':
        toolStore.setTool('pencil')
        break
      case 'e':
        toolStore.setTool('eraser')
        break
      case 'g':
        toolStore.setTool('fill')
        break
      case 'i':
        toolStore.setTool('eyedropper')
        break
      case 's':
        toolStore.setTool('shape')
        break
      case '1':
        if (toolStore.activeTool === 'shape') toolStore.setShapeType('line')
        break
      case '2':
        if (toolStore.activeTool === 'shape') toolStore.setShapeType('rect')
        break
      case '3':
        if (toolStore.activeTool === 'shape') toolStore.setShapeType('ellipse')
        break
      case 'f':
        if (toolStore.activeTool === 'shape' && toolStore.shapeType !== 'line') {
          toolStore.toggleShapeFilled()
        }
        break
      case 'q':
        if (toolStore.activeTool === 'shape' && toolStore.shapeType !== 'line') {
          toolStore.toggleShapeConstrain()
        }
        break
      case 'h':
        if (toolStore.activeTool === 'pencil' || toolStore.activeTool === 'eraser') {
          toolStore.toggleSymmetryHorizontal()
        }
        break
      case 'v':
        if (toolStore.activeTool === 'pencil' || toolStore.activeTool === 'eraser') {
          toolStore.toggleSymmetryVertical()
        }
        break
      case '+':
      case '=':
        settings.zoom = Math.min(64, Math.round(settings.zoom * 1.5))
        break
      case '-':
        settings.zoom = Math.max(1, Math.round(settings.zoom / 1.5))
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
  })
}
