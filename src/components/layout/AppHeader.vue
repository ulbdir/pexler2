<script setup lang="ts">
import { computed } from 'vue'
import { Undo2, Redo2 } from 'lucide-vue-next'
import { useHistoryStore } from '@/stores/historyStore'
import { useI18n } from '@/i18n'
import Tooltip from '@/components/ui/Tooltip.vue'
import BildMenu from '@/components/header/BildMenu.vue'
import FarbpaletteMenu from '@/components/header/FarbpaletteMenu.vue'
import SettingsButton from '@/components/header/SettingsButton.vue'

const { t } = useI18n()
const historyStore = useHistoryStore()

const canUndo = computed(() => historyStore.undoStack.length > 0)
const canRedo = computed(() => historyStore.redoStack.length > 0)

const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
const modKey = isMac ? '⌘' : 'Ctrl+'
</script>

<template>
  <header class="grid grid-cols-3 items-center px-4 py-2 bg-surface border-b border-edge">
    <h1 class="font-pixel text-5xl drop-shadow-lg font-bold text-foreground-muted">Pexler</h1>
    <div class="flex items-center justify-center gap-1">
      <BildMenu />
      <FarbpaletteMenu />
    </div>
    <div class="flex items-center justify-end gap-2">
      <div class="flex items-center gap-1">
        <Tooltip :label="t('actions.undo')" :shortcut="`${modKey}Z`">
          <button
            class="w-8 h-8 flex items-center justify-center rounded transition-colors"
            :class="canUndo
              ? 'text-foreground-secondary hover:bg-hover'
              : 'text-foreground-muted/40 cursor-not-allowed'"
            :disabled="!canUndo"
            @click="historyStore.undo()"
          >
            <Undo2 class="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip :label="t('actions.redo')" :shortcut="`${modKey}⇧Z`">
          <button
            class="w-8 h-8 flex items-center justify-center rounded transition-colors"
            :class="canRedo
              ? 'text-foreground-secondary hover:bg-hover'
              : 'text-foreground-muted/40 cursor-not-allowed'"
            :disabled="!canRedo"
            @click="historyStore.redo()"
          >
            <Redo2 class="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
      <SettingsButton />
    </div>
  </header>
</template>
