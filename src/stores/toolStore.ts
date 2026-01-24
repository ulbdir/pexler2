import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToolType, ShapeType, Point } from '@/types'

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

  function setTool(tool: ToolType) {
    activeTool.value = tool
    pendingShape.value = null
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

  return {
    activeTool,
    shapeType,
    shapeFilled,
    shapeConstrain,
    pendingShape,
    setTool,
    setShapeType,
    toggleShapeFilled,
    toggleShapeConstrain,
    setPendingShape,
  }
})
