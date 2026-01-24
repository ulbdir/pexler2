<script setup lang="ts">
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverPortal } from 'radix-vue'
import { Settings } from 'lucide-vue-next'
import { useI18n } from '@/i18n'
import { useSettingsStore } from '@/stores/settingsStore'

const { t, locale, setLocale, supportedLocales } = useI18n()
const settings = useSettingsStore()

const checkerSizes = [4, 8, 16, 32] as const
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      class="w-8 h-8 flex items-center justify-center hover:bg-hover-emphasis rounded cursor-pointer"
      :title="t('settings.title')"
    >
      <Settings class="w-4 h-4 text-foreground-secondary" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        class="w-56 bg-surface-overlay border border-edge rounded shadow-md p-3 z-50"
        :side-offset="4"
      >
        <h3 class="text-xs font-semibold text-foreground-secondary mb-3">{{ t('settings.title') }}</h3>

        <label class="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.gridVisible"
            class="accent-accent"
            @change="settings.gridVisible = ($event.target as HTMLInputElement).checked"
          />
          <span class="text-sm text-foreground">{{ t('settings.showGrid') }}</span>
        </label>

        <label class="flex items-center gap-2 mb-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="settings.backgroundEnabled"
            class="accent-accent"
            @change="settings.backgroundEnabled = ($event.target as HTMLInputElement).checked"
          />
          <span class="text-sm text-foreground">{{ t('settings.checkerBackground') }}</span>
        </label>

        <div class="mt-2">
          <span class="text-xs text-foreground-muted block mb-1">{{ t('settings.checkerSize') }}</span>
          <div class="flex gap-1">
            <button
              v-for="size in checkerSizes"
              :key="size"
              class="px-2 py-0.5 text-xs rounded border cursor-pointer"
              :class="settings.checkerSize === size
                ? 'bg-surface-selected border-edge-active text-foreground'
                : 'bg-surface-panel border-edge-subtle text-foreground-muted hover:bg-hover'"
              @click="settings.checkerSize = size"
            >
              {{ size }}px
            </button>
          </div>
        </div>

        <div class="mt-3 pt-2 border-t border-edge-subtle">
          <span class="text-xs text-foreground-muted block mb-1">{{ t('settings.language') }}</span>
          <div class="flex gap-1">
            <button
              v-for="loc in supportedLocales"
              :key="loc"
              class="px-2 py-0.5 text-xs rounded border cursor-pointer"
              :class="locale === loc
                ? 'bg-surface-selected border-edge-active text-foreground'
                : 'bg-surface-panel border-edge-subtle text-foreground-muted hover:bg-hover'"
              @click="setLocale(loc)"
            >
              {{ loc.toUpperCase() }}
            </button>
          </div>
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
