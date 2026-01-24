<script setup lang="ts">
import BildMenu from '@/components/header/BildMenu.vue'
import FarbpaletteMenu from '@/components/header/FarbpaletteMenu.vue'
import SettingsButton from '@/components/header/SettingsButton.vue'
</script>

<template>
  <header class="grid grid-cols-3 items-center px-4 py-2 bg-surface border-b border-edge">
    <h1 class="font-pixel text-5xl drop-shadow-lg font-bold text-foreground-muted">Pexler</h1>
    <div class="flex items-center justify-center gap-1">
      <BildMenu />
      <FarbpaletteMenu />
    </div>
    <div class="flex items-center justify-end">
      <SettingsButton />
    </div>
  </header>
</template>
