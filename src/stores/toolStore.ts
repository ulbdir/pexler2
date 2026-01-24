import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ToolType } from '@/types'

export const useToolStore = defineStore('tool', () => {
  const activeTool = ref<ToolType>('pencil')

  function setTool(tool: ToolType) {
    activeTool.value = tool
  }

  return { activeTool, setTool }
})
