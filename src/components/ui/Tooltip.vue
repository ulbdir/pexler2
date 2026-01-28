<script setup lang="ts">
import { TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from 'radix-vue'
import Kbd from './Kbd.vue'

defineProps<{
  label: string
  shortcut?: string
}>()
</script>

<template>
  <TooltipRoot :delay-duration="300">
    <TooltipTrigger as-child>
      <slot />
    </TooltipTrigger>
    <TooltipPortal>
      <TooltipContent
        class="bg-surface-panel border border-edge rounded px-3 py-2
               text-xs text-foreground shadow-md flex items-center gap-2"
        :side-offset="5"
      >
        {{ label }}
        <Kbd v-if="shortcut">{{ shortcut }}</Kbd>
      </TooltipContent>
    </TooltipPortal>
  </TooltipRoot>
</template>
