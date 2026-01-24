<script setup lang="ts">
import { Pencil, Eraser, PaintBucket, Pipette } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import ToolButton from './ToolButton.vue'

const { t } = useI18n()
</script>

<template>
  <div>
    <h2 class="text-xs font-semibold text-foreground-secondary mb-2">{{ t('tools.title') }}</h2>
    <div class="grid grid-cols-2 gap-1">
      <ToolButton tool="pencil" :title="`${t('tools.pencil')} (P)`">
        <Pencil class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="eraser" :title="`${t('tools.eraser')} (E)`">
        <Eraser class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="fill" :title="`${t('tools.fill')} (G)`">
        <PaintBucket class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="eyedropper" :title="`${t('tools.eyedropper')} (I)`">
        <Pipette class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
    </div>
  </div>
</template>
