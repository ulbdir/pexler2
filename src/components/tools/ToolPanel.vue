<script setup lang="ts">
import { computed } from 'vue'
import { Pencil, Eraser, PaintBucket, Pipette, Shapes, Minus, Square, Circle } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useToolStore } from '@/stores/toolStore'
import ToolButton from './ToolButton.vue'
import type { ShapeType } from '@/types'

const { t } = useI18n()
const toolStore = useToolStore()

const isShapeActive = computed(() => toolStore.activeTool === 'shape')

function setShapeType(type: ShapeType) {
  toolStore.setShapeType(type)
}
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
      <ToolButton tool="shape" :title="`${t('tools.shape')} (S)`">
        <Shapes class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
    </div>

    <!-- Shape options (visible when shape tool is active) -->
    <div v-if="isShapeActive" class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
      <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.shapeType') }}</h3>
      <div class="grid grid-cols-3 gap-1">
        <button
          class="w-full h-7 flex items-center justify-center border rounded transition-colors"
          :class="toolStore.shapeType === 'line'
            ? 'bg-surface-selected border-edge-active'
            : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
          :title="t('tools.shapeLine')"
          @click="setShapeType('line')"
        >
          <Minus class="w-3.5 h-3.5 text-foreground-secondary" />
        </button>
        <button
          class="w-full h-7 flex items-center justify-center border rounded transition-colors"
          :class="toolStore.shapeType === 'rect'
            ? 'bg-surface-selected border-edge-active'
            : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
          :title="t('tools.shapeRect')"
          @click="setShapeType('rect')"
        >
          <Square class="w-3.5 h-3.5 text-foreground-secondary" />
        </button>
        <button
          class="w-full h-7 flex items-center justify-center border rounded transition-colors"
          :class="toolStore.shapeType === 'ellipse'
            ? 'bg-surface-selected border-edge-active'
            : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
          :title="t('tools.shapeEllipse')"
          @click="setShapeType('ellipse')"
        >
          <Circle class="w-3.5 h-3.5 text-foreground-secondary" />
        </button>
      </div>

      <div v-if="toolStore.shapeType !== 'line'" class="space-y-1.5">
        <label class="flex items-center gap-1.5 text-xs text-foreground-secondary cursor-pointer">
          <input
            type="checkbox"
            class="accent-edge-active"
            :checked="toolStore.shapeFilled"
            @change="toolStore.toggleShapeFilled()"
          />
          {{ t('tools.shapeFilled') }}
        </label>
        <label class="flex items-center gap-1.5 text-xs text-foreground-secondary cursor-pointer">
          <input
            type="checkbox"
            class="accent-edge-active"
            :checked="toolStore.shapeConstrain"
            @change="toolStore.toggleShapeConstrain()"
          />
          {{ toolStore.shapeType === 'rect' ? t('tools.shapeSquare') : t('tools.shapeCircle') }}
        </label>
      </div>
    </div>
  </div>
</template>
