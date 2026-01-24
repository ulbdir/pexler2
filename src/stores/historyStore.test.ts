import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useHistoryStore } from './historyStore'
import { useCanvasStore } from './canvasStore'

describe('historyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('pushState saves current canvas state to undo stack', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(2, 2)
    canvas.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })

    history.pushState()

    expect(history.undoStack.length).toBe(1)
    expect(history.undoStack[0]!.width).toBe(2)
    expect(history.undoStack[0]!.height).toBe(2)
  })

  it('pushState clears redo stack', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(2, 2)

    history.pushState()
    canvas.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })
    history.pushState()
    history.undo()
    expect(history.redoStack.length).toBe(1)

    history.pushState()
    expect(history.redoStack.length).toBe(0)
  })

  it('pushState truncates undo stack beyond MAX_HISTORY (50)', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(1, 1)

    for (let i = 0; i < 55; i++) {
      history.pushState()
    }

    expect(history.undoStack.length).toBe(50)
  })

  it('undo restores previous state and pushes current to redo', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(2, 2)

    // Draw red pixel, push state
    canvas.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })
    history.pushState()

    // Draw blue pixel
    canvas.setPixel(0, 0, { r: 0, g: 0, b: 255, a: 255 })

    // Undo should restore the red pixel state
    history.undo()
    expect(canvas.getPixel(0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
    expect(history.undoStack.length).toBe(0)
    expect(history.redoStack.length).toBe(1)
  })

  it('undo does nothing when stack is empty', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(2, 2)
    canvas.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })

    history.undo()

    expect(canvas.getPixel(0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
    expect(history.redoStack.length).toBe(0)
  })

  it('redo restores next state and pushes current to undo', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(2, 2)

    history.pushState()
    canvas.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })
    history.pushState()
    canvas.setPixel(0, 0, { r: 0, g: 255, b: 0, a: 255 })

    history.undo()
    history.undo()
    // Canvas should be blank now
    expect(canvas.getPixel(0, 0).a).toBe(0)

    history.redo()
    expect(canvas.getPixel(0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })
    expect(history.undoStack.length).toBe(1)
  })

  it('redo does nothing when stack is empty', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(2, 2)

    history.redo()

    expect(history.undoStack.length).toBe(0)
  })

  it('multiple undo and redo cycle', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(1, 1)

    // State 0: transparent
    history.pushState()
    canvas.setPixel(0, 0, { r: 255, g: 0, b: 0, a: 255 })
    // State 1: red
    history.pushState()
    canvas.setPixel(0, 0, { r: 0, g: 255, b: 0, a: 255 })
    // Current: green

    history.undo() // back to red
    expect(canvas.getPixel(0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })

    history.undo() // back to transparent
    expect(canvas.getPixel(0, 0).a).toBe(0)

    history.redo() // forward to red
    expect(canvas.getPixel(0, 0)).toEqual({ r: 255, g: 0, b: 0, a: 255 })

    history.redo() // forward to green
    expect(canvas.getPixel(0, 0)).toEqual({ r: 0, g: 255, b: 0, a: 255 })
  })

  it('clear empties both stacks', () => {
    const history = useHistoryStore()
    const canvas = useCanvasStore()
    canvas.createNew(1, 1)

    history.pushState()
    history.pushState()
    history.undo()

    expect(history.undoStack.length).toBe(1)
    expect(history.redoStack.length).toBe(1)

    history.clear()
    expect(history.undoStack.length).toBe(0)
    expect(history.redoStack.length).toBe(0)
  })
})
