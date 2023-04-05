<script setup lang="ts">
import BackgroundMusic from './components/background-music.vue'
import DefaultTimerSound from './components/default-timer-sound.vue'
import MusicRepository from './components/music-repository.vue'
import SoundsRepository from './components/sounds-repository.vue'
import TimerTimeout from './components/timer-timeout.vue'
</script>

<template>
  <UiCard variant="flat" class="w-[100%]">
    <UiList>
      <UiListSubheader>
        {{ $t("settings-page.sounds-and-music-page.background-music") }}
      </UiListSubheader>

      <UiListItem variant="plain">
        <background-music />
      </UiListItem>
    </UiList>
    <UiDivider />
    <UiList>
      <UiListSubheader>
        {{ $t("settings-page.sounds-and-music-page.default-timer-sound") }}
      </UiListSubheader>

      <UiListItem variant="plain">
        <DefaultTimerSound />
      </UiListItem>
      <UiListSubheader>
        {{ $t("settings-page.sounds-and-music-page.timer-timeout") }}
      </UiListSubheader>

      <UiListItem class="list-item-overflow-visible" variant="plain">
        <TimerTimeout />
      </UiListItem>
    </UiList>
    <UiDivider />
    <UiList>
      <UiListSubheader>
        {{
          $t("settings-page.sounds-and-music-page.music-repository")
        }}
      </UiListSubheader>

      <UiListItem variant="plain">
        <MusicRepository />
      </UiListItem>
    </UiList>
    <UiDivider />
    <UiList>
      <UiListSubheader>
        {{
          $t("settings-page.sounds-and-music-page.sound-repository")
        }}
      </UiListSubheader>

      <UiListItem variant="plain">
        <SoundsRepository />
      </UiListItem>
    </UiList>
  </UiCard>
</template>

<style scoped>
.list-item-overflow-visible:deep() .v-list-item__content {
  overflow: visible;
}
</style>

<route lang="yaml">
name: "Sounds and music"
meta:
  title: "Sounds and music page"
  layout: popup-default
</route>
