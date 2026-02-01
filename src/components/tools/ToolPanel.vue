<script setup lang="ts">
import { computed } from 'vue'
import { Pencil, Eraser, PaintBucket, Pipette, Shapes, Minus, Square, Circle, FlipHorizontal, FlipVertical, Blend, Plus, RefreshCcw } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useToolStore } from '@/stores/toolStore'
import ToolButton from './ToolButton.vue'
import Tooltip from '@/components/ui/Tooltip.vue'
import type { ShapeType } from '@/types'

const { t } = useI18n()
const toolStore = useToolStore()

const isShapeActive = computed(() => toolStore.activeTool === 'shape')
const isPencilOrEraserActive = computed(() => toolStore.activeTool === 'pencil' || toolStore.activeTool === 'eraser')
const isReplaceActive = computed(() => toolStore.activeTool === 'replace')

function setShapeType(type: ShapeType) {
  toolStore.setShapeType(type)
}
</script>

<template>
  <div>
    <h2 class="text-xs font-semibold text-foreground-secondary mb-2">{{ t('tools.title') }}</h2>
    <div class="grid grid-cols-2 gap-1">
      <ToolButton tool="pencil" :label="t('tools.pencil')" shortcut="P">
        <Pencil class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="eraser" :label="t('tools.eraser')" shortcut="E">
        <Eraser class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="fill" :label="t('tools.fill')" shortcut="G">
        <PaintBucket class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="eyedropper" :label="t('tools.eyedropper')" shortcut="I">
        <Pipette class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="replace" :label="t('tools.replace')">
        <RefreshCcw class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
      <ToolButton tool="shape" :label="t('tools.shape')" shortcut="S">
        <Shapes class="w-4 h-4 text-foreground-secondary" />
      </ToolButton>
    </div>

    <!-- Pencil/Eraser options -->
    <template v-if="isPencilOrEraserActive">
      <!-- Brush Size -->
      <div class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
        <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.brushSize') }}</h3>
        
        <!-- Stepper: decrease / size display / increase -->
        <div class="flex items-center gap-1">
          <Tooltip :label="t('tools.brushSizeDecrease')" shortcut="[">
            <button
              class="w-7 h-7 flex items-center justify-center border rounded transition-colors bg-surface-overlay border-edge-subtle hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="toolStore.brushSize <= 1"
              @click="toolStore.decreaseBrushSize()"
            >
              <Minus class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
          <span class="flex-1 text-center text-sm text-foreground-secondary font-medium">{{ toolStore.brushSize }}px</span>
          <Tooltip :label="t('tools.brushSizeIncrease')" shortcut="]">
            <button
              class="w-7 h-7 flex items-center justify-center border rounded transition-colors bg-surface-overlay border-edge-subtle hover:bg-hover disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="toolStore.brushSize >= 16"
              @click="toolStore.increaseBrushSize()"
            >
              <Plus class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
        </div>

        <!-- Quick preset buttons -->
        <div class="grid grid-cols-4 gap-1">
          <Tooltip v-for="size in [1, 3, 5, 8]" :key="size" :label="`${size}px`">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors text-xs font-medium"
              :class="toolStore.brushSize === size
                ? 'bg-surface-selected border-edge-active text-foreground'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover text-foreground-secondary'"
              @click="toolStore.setBrushSize(size)"
            >
              {{ size }}
            </button>
          </Tooltip>
        </div>

        <!-- Shape toggle: square / circle -->
        <div class="grid grid-cols-2 gap-1">
          <Tooltip :label="t('tools.brushSquare')">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.brushShape === 'square'
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="toolStore.setBrushShape('square')"
            >
              <Square class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
          <Tooltip :label="t('tools.brushCircle')">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.brushShape === 'circle'
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="toolStore.setBrushShape('circle')"
            >
              <Circle class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
        </div>
      </div>

      <!-- Blend Mode (pencil only) -->
      <div v-if="toolStore.activeTool === 'pencil'" class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
        <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.blendMode') }}</h3>
        <Tooltip :label="toolStore.blendMode === 'blend' ? t('tools.blendModeOverwriteDesc') : t('tools.blendModeBlendDesc')" shortcut="B">
          <button
            class="w-full h-7 flex items-center justify-center border rounded transition-colors"
            :class="toolStore.blendMode === 'blend'
              ? 'bg-surface-selected border-edge-active'
              : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
            @click="toolStore.toggleBlendMode()"
          >
            <Blend class="w-3.5 h-3.5 text-foreground-secondary" />
          </button>
        </Tooltip>
      </div>

      <!-- Symmetry -->
      <div class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
        <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.symmetry') }}</h3>
        <div class="grid grid-cols-2 gap-1">
          <Tooltip :label="t('tools.mirrorHorizontalDesc')" shortcut="H">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.symmetryHorizontal
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="toolStore.toggleSymmetryHorizontal()"
            >
              <FlipVertical class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
          <Tooltip :label="t('tools.mirrorVerticalDesc')" shortcut="V">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.symmetryVertical
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="toolStore.toggleSymmetryVertical()"
            >
              <FlipHorizontal class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
        </div>
      </div>
    </template>

    <!-- Shape tool options -->
    <template v-if="isShapeActive">
      <!-- Shape Type -->
      <div class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
        <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.shapeType') }}</h3>
        <div class="grid grid-cols-3 gap-1">
          <Tooltip :label="t('tools.shapeLine')" shortcut="1">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.shapeType === 'line'
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="setShapeType('line')"
            >
              <Minus class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
          <Tooltip :label="t('tools.shapeRect')" shortcut="2">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.shapeType === 'rect'
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="setShapeType('rect')"
            >
              <Square class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
          <Tooltip :label="t('tools.shapeEllipse')" shortcut="3">
            <button
              class="w-full h-7 flex items-center justify-center border rounded transition-colors"
              :class="toolStore.shapeType === 'ellipse'
                ? 'bg-surface-selected border-edge-active'
                : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
              @click="setShapeType('ellipse')"
            >
              <Circle class="w-3.5 h-3.5 text-foreground-secondary" />
            </button>
          </Tooltip>
        </div>

        <div v-if="toolStore.shapeType !== 'line'" class="space-y-1.5">
          <Tooltip :label="t('tools.shapeFilledDesc')" shortcut="F">
            <label class="flex items-center gap-1.5 text-xs text-foreground-secondary cursor-pointer">
              <input
                type="checkbox"
                class="accent-edge-active"
                :checked="toolStore.shapeFilled"
                @change="toolStore.toggleShapeFilled()"
              />
              {{ t('tools.shapeFilled') }}
            </label>
          </Tooltip>
          <Tooltip :label="t('tools.shapeConstrainDesc')" shortcut="Q">
            <label class="flex items-center gap-1.5 text-xs text-foreground-secondary cursor-pointer">
              <input
                type="checkbox"
                class="accent-edge-active"
                :checked="toolStore.shapeConstrain"
                @change="toolStore.toggleShapeConstrain()"
              />
              {{ toolStore.shapeType === 'rect' ? t('tools.shapeSquare') : t('tools.shapeCircle') }}
            </label>
          </Tooltip>
        </div>
      </div>

      <!-- Blend Mode -->
      <div class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
        <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.blendMode') }}</h3>
        <Tooltip :label="toolStore.blendMode === 'blend' ? t('tools.blendModeOverwriteDesc') : t('tools.blendModeBlendDesc')" shortcut="B">
          <button
            class="w-full h-7 flex items-center justify-center border rounded transition-colors"
            :class="toolStore.blendMode === 'blend'
              ? 'bg-surface-selected border-edge-active'
              : 'bg-surface-overlay border-edge-subtle hover:bg-hover'"
            @click="toolStore.toggleBlendMode()"
          >
            <Blend class="w-3.5 h-3.5 text-foreground-secondary" />
          </button>
        </Tooltip>
      </div>
    </template>

    <!-- Replace tool options -->
    <template v-if="isReplaceActive">
      <div class="mt-3 pt-3 border-t border-edge-subtle space-y-2">
        <h3 class="text-xs font-semibold text-foreground-secondary">{{ t('tools.replace') }}</h3>
        
        <Tooltip :label="t('tools.replaceIgnoreAlpha')">
          <label class="flex items-center gap-1.5 text-xs text-foreground-secondary cursor-pointer">
            <input
              type="checkbox"
              class="accent-edge-active"
              :checked="toolStore.replaceIgnoreAlpha"
              @change="toolStore.toggleReplaceIgnoreAlpha()"
            />
            {{ t('tools.replaceIgnoreAlpha') }}
          </label>
        </Tooltip>
        
        <p class="text-xs text-foreground-muted leading-relaxed">
          {{ t('tools.replaceDesc') }}
        </p>
      </div>
    </template>
  </div>
</template>
