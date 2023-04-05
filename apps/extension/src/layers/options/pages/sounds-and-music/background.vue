<script setup lang="ts">
import { useBackgroundMusicStore } from '@/logic/storage/background-music'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
const soundsAndMusicStore = useSoundsAndMusicStore()
const backgroundMusicStore = useBackgroundMusicStore()

const soundItems = computed(() => [
  ...Object.entries(soundsAndMusicStore.sounds).map(x => ({
    value: x[0],
    title: x[1].name
  })),
  {
    value: undefined,
    title: 'no music'
  }
])
</script>

<template>
  <UiLayout class="d-flex flex-column">
    <v-toolbar :border="true" density="compact" :title="'Background music'" />
    <v-select
      v-model="backgroundMusicStore.data.musicKey"
      label="Type"
      :items="soundItems"
    >
      <template #prepend>
        <UiIcon>
          <icon-mdi-folder />
        </UiIcon>
      </template>
    </v-select>
  </UiLayout>
</template>

<route lang="yaml">
name: "Background music"
meta:
  title: "Background music page"
  layout: options-default
</route>
