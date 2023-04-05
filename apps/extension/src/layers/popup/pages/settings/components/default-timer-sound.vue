<script setup lang="ts">
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
const defaultTimerSoundStore = useDefaultTimerSoundStore()
const soundsAndMusicStore = useSoundsAndMusicStore()

const soundItems = computed(() => [
  {
    value: undefined,
    title: ''
  },
  ...Object.entries(soundsAndMusicStore.sounds).map(x => ({
    value: x[0],
    title: x[1].name
  }))
])
</script>

<template>
  <UiSelect
    v-model="defaultTimerSoundStore.data.soundKey"
    :label="$t('settings-page.sounds-and-music-page.sound')"
    :items="soundItems"
  >
    <template #prepend>
      <UiIcon>
        <icon-mdi-folder />
      </UiIcon>
    </template>
  </UiSelect>
</template>
