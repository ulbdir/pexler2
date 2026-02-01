import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToolType, ShapeType, Point, BlendMode, BrushShape } from '@/types'

export interface PendingShape {
  start: Point
  end: Point
}

export const useToolStore = defineStore('tool', () => {
  const activeTool = ref<ToolType>('pencil')
  const shapeType = ref<ShapeType>('line')
  const shapeFilled = ref(false)
  const shapeConstrain = ref(false)
  const pendingShape = ref<PendingShape | null>(null)

  // Symmetry drawing state
  const symmetryHorizontal = ref(false)
  const symmetryVertical = ref(false)
  const hoverPosition = ref<Point | null>(null)

  // Blend mode state (shared between pencil and shape tools)
  const blendMode = ref<BlendMode>('overwrite')

  // Brush settings (shared between pencil and eraser)
  const brushSize = ref<number>(1)
  const brushShape = ref<BrushShape>('square')

  // Replace tool settings
  const replaceIgnoreAlpha = ref(false)

  function setTool(tool: ToolType) {
    activeTool.value = tool
    pendingShape.value = null
    hoverPosition.value = null
  }

  function setShapeType(type: ShapeType) {
    shapeType.value = type
    pendingShape.value = null
  }

  function toggleShapeFilled() {
    shapeFilled.value = !shapeFilled.value
  }

  function toggleShapeConstrain() {
    shapeConstrain.value = !shapeConstrain.value
  }

  function setPendingShape(shape: PendingShape | null) {
    pendingShape.value = shape
  }

  function toggleSymmetryHorizontal() {
    symmetryHorizontal.value = !symmetryHorizontal.value
  }

  function toggleSymmetryVertical() {
    symmetryVertical.value = !symmetryVertical.value
  }

  function toggleBlendMode() {
    blendMode.value = blendMode.value === 'overwrite' ? 'blend' : 'overwrite'
  }

  function setBlendMode(mode: BlendMode) {
    blendMode.value = mode
  }

  function setBrushSize(size: number) {
    brushSize.value = Math.max(1, Math.min(16, Math.round(size)))
  }

  function setBrushShape(shape: BrushShape) {
    brushShape.value = shape
  }

  function increaseBrushSize() {
    setBrushSize(brushSize.value + 1)
  }

  function decreaseBrushSize() {
    setBrushSize(brushSize.value - 1)
  }

  function setHoverPosition(pos: Point | null) {
    hoverPosition.value = pos
  }

  function toggleReplaceIgnoreAlpha() {
    replaceIgnoreAlpha.value = !replaceIgnoreAlpha.value
  }

  function getSymmetryPoints(x: number, y: number, canvasWidth: number, canvasHeight: number): Point[] {
    const points: Point[] = [{ x, y }]

    if (symmetryHorizontal.value) {
      const mirrorY = (canvasHeight - 1) - y
      if (mirrorY !== y && mirrorY >= 0 && mirrorY < canvasHeight) {
        points.push({ x, y: mirrorY })
      }
    }

    if (symmetryVertical.value) {
      const mirrorX = (canvasWidth - 1) - x
      if (mirrorX !== x && mirrorX >= 0 && mirrorX < canvasWidth) {
        points.push({ x: mirrorX, y })
      }
    }

    // If both symmetries are enabled, also add the diagonal mirror point
    if (symmetryHorizontal.value && symmetryVertical.value) {
      const mirrorX = (canvasWidth - 1) - x
      const mirrorY = (canvasHeight - 1) - y
      if (mirrorX !== x && mirrorY !== y && mirrorX >= 0 && mirrorX < canvasWidth && mirrorY >= 0 && mirrorY < canvasHeight) {
        points.push({ x: mirrorX, y: mirrorY })
      }
    }

    return points
  }

  function $reset() {
    activeTool.value = 'pencil'
    shapeType.value = 'line'
    shapeFilled.value = false
    shapeConstrain.value = false
    pendingShape.value = null
    symmetryHorizontal.value = false
    symmetryVertical.value = false
    hoverPosition.value = null
    blendMode.value = 'overwrite'
    brushSize.value = 1
    brushShape.value = 'square'
    replaceIgnoreAlpha.value = false
  }

  return {
    activeTool,
    shapeType,
    shapeFilled,
    shapeConstrain,
    pendingShape,
    symmetryHorizontal,
    symmetryVertical,
    blendMode,
    hoverPosition,
    brushSize,
    brushShape,
    replaceIgnoreAlpha,
    setTool,
    setShapeType,
    toggleShapeFilled,
    toggleShapeConstrain,
    setPendingShape,
    toggleSymmetryHorizontal,
    toggleSymmetryVertical,
    toggleBlendMode,
    setBlendMode,
    setHoverPosition,
    getSymmetryPoints,
    setBrushSize,
    setBrushShape,
    increaseBrushSize,
    decreaseBrushSize,
    toggleReplaceIgnoreAlpha,
    $reset,
  }
})
