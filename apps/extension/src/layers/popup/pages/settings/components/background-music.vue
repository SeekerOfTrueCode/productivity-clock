<script setup lang="ts">
import { useBackgroundMusicStore } from '@/logic/storage/background-music'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
const soundsAndMusicStore = useSoundsAndMusicStore()
const backgroundMusicStore = useBackgroundMusicStore()

const musicItems = computed(() => [
  {
    value: undefined,
    title: ''
  },
  ...Object.entries(soundsAndMusicStore.music).map(x => ({
    value: x[0],
    title: x[1].name
  }))
])
</script>

<template>
  <UiSelect
    v-model="backgroundMusicStore.data.musicKey"
    :label="$t('settings-page.sounds-and-music-page.music')"
    :items="musicItems"
  >
    <template #prepend>
      <UiIcon>
        <icon-mdi-folder />
      </UiIcon>
    </template>
  </UiSelect>
</template>
