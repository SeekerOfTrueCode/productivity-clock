<script setup lang="ts">
import { useBackgroundMusicStore } from '@/logic/storage/background-music'
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'
import { useToggle } from '@vueuse/core'

const [showVolumeMenu] = useToggle()

const backgroundMusicStore = useBackgroundMusicStore()
const defaultTimerSoundStore = useDefaultTimerSoundStore()
</script>

<template>
  <UiMenu
    v-model="showVolumeMenu"
    :close-on-content-click="false"
    offset="3rem"
    location="bottom"
  >
    <template #activator="{ props }">
      <UiBtn
        :tooltip="{ text: $t('app-bar.audio.button-title'), location: 'top' }"
        size="small"
        icon
        v-bind="props"
      >
        <UiIcon>
          <icon-mdi-volume-high />
        </UiIcon>
      </UiBtn>
    </template>

    <UiCard variant="outlined" class="py-2 pl-2 pr-4" width="300">
      <div class="d-flex">
        <UiSlider v-model="backgroundMusicStore.data.volume" hide-details>
          <template #prepend>
            <UiBtn
              size="small"
              icon
              @click="
                backgroundMusicStore.data.enabled =
                  !backgroundMusicStore.data.enabled
              "
            >
              <UiIcon>
                <icon-mdi-music v-if="backgroundMusicStore.data.enabled" />
                <icon-mdi-music-off v-else />
              </UiIcon>
            </UiBtn>
          </template>
        </UiSlider>
        <v-tooltip activator="parent" location="top">
          {{ $t("app-bar.audio.background-music") }}
        </v-tooltip>
      </div>
      <!--  -->
      <div class="d-flex">
        <UiSlider v-model="defaultTimerSoundStore.data.volume" hide-details>
          <template #prepend>
            <UiBtn
              size="small"
              icon
              @click="
                defaultTimerSoundStore.data.enabled =
                  !defaultTimerSoundStore.data.enabled
              "
            >
              <UiIcon>
                <icon-mdi-timer-music
                  v-if="defaultTimerSoundStore.data.enabled"
                />
                <icon-mdi-timer-off v-else />
              </UiIcon>
            </UiBtn>
          </template>
        </UiSlider>
        <v-tooltip activator="parent" location="top">
          {{ $t("app-bar.audio.timer-sound") }}
        </v-tooltip>
      </div>
    </UiCard>
  </UiMenu>
</template>
