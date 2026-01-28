<script setup lang="ts">
import { computed } from 'vue'
import { useToolStore } from '@/stores/toolStore'
import Tooltip from '@/components/ui/Tooltip.vue'
import type { ToolType } from '@/types'

const props = defineProps<{
  tool: ToolType
  label: string
  shortcut: string
}>()

const toolStore = useToolStore()
const isActive = computed(() => toolStore.activeTool === props.tool)
</script>

<template>
  <Tooltip :label="label" :shortcut="shortcut">
    <button
      class="w-9 h-9 flex items-center justify-center border rounded transition-colors"
      :class="isActive
        ? 'bg-surface-selected border-edge-active'
        : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
      @click="toolStore.setTool(tool)"
    >
      <slot />
    </button>
  </Tooltip>
</template>
