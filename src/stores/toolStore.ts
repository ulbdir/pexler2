import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToolType, ShapeType, Point, BlendMode } from '@/types'

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

  function setHoverPosition(pos: Point | null) {
    hoverPosition.value = pos
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
    $reset,
  }
})
