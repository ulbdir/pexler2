<script setup lang="ts">
import { computed } from 'vue'
import { useToolStore } from '@/stores/toolStore'
import type { ToolType } from '@/types'

const props = defineProps<{
  tool: ToolType
  title: string
}>()

const toolStore = useToolStore()
const isActive = computed(() => toolStore.activeTool === props.tool)
</script>

<template>
  <button
    class="w-9 h-9 flex items-center justify-center border rounded transition-colors"
    :class="isActive
      ? 'bg-surface-selected border-edge-active'
      : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
    :title="title"
    @click="toolStore.setTool(tool)"
  >
    <slot />
  </button>
</template>
