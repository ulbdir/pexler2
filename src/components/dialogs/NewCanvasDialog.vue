<script setup lang="ts">
import { ref } from 'vue'
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogClose,
} from 'radix-vue'
import { useI18n } from '@/i18n'
import { useCanvasStore } from '@/stores/canvasStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { useHistoryStore } from '@/stores/historyStore'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()

const { t } = useI18n()
const canvasStore = useCanvasStore()
const settingsStore = useSettingsStore()
const historyStore = useHistoryStore()

const newWidth = ref(32)
const newHeight = ref(32)

const presets = [16, 32, 64, 128] as const

function setPreset(size: number) {
  newWidth.value = size
  newHeight.value = size
}

function createCanvas() {
  const w = Math.max(1, Math.min(512, newWidth.value || 32))
  const h = Math.max(1, Math.min(512, newHeight.value || 32))
  historyStore.clear()
  canvasStore.createNew(w, h)
  const container = document.querySelector('main')
  if (container) {
    settingsStore.resetView(w, h, container.clientWidth, container.clientHeight)
  }
  emit('update:open', false)
}
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 bg-black/30 z-50" />
      <DialogContent
        class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-overlay border border-edge rounded-lg shadow-lg p-5 w-72 z-50"
      >
        <DialogTitle class="text-sm font-semibold text-foreground mb-4">
          {{ t('dialog.newCanvas.title') }}
        </DialogTitle>

        <div class="space-y-3">
          <div>
            <label class="text-sm text-foreground-secondary block mb-1">{{ t('dialog.newCanvas.width') }}</label>
            <input
              v-model.number="newWidth"
              type="number"
              min="1"
              max="512"
              class="w-full px-2 py-1 border border-edge rounded bg-white text-sm"
            />
          </div>
          <div>
            <label class="text-sm text-foreground-secondary block mb-1">{{ t('dialog.newCanvas.height') }}</label>
            <input
              v-model.number="newHeight"
              type="number"
              min="1"
              max="512"
              class="w-full px-2 py-1 border border-edge rounded bg-white text-sm"
            />
          </div>

          <div>
            <span class="text-xs text-foreground-muted block mb-1">{{ t('dialog.newCanvas.presets') }}</span>
            <div class="flex gap-1">
              <button
                v-for="size in presets"
                :key="size"
                class="px-2 py-0.5 text-xs bg-surface-panel border border-edge-subtle rounded hover:bg-hover cursor-pointer"
                @click="setPreset(size)"
              >
                {{ size }}x{{ size }}
              </button>
            </div>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <DialogClose
              class="px-3 py-1 text-sm bg-surface border border-edge rounded hover:bg-hover-emphasis cursor-pointer"
            >
              {{ t('dialog.newCanvas.cancel') }}
            </DialogClose>
            <button
              class="px-3 py-1 text-sm bg-surface-primary text-foreground-on-primary border border-edge-active rounded hover:bg-surface-primary-hover cursor-pointer"
              @click="createCanvas"
            >
              {{ t('dialog.newCanvas.create') }}
            </button>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
