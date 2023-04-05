<script setup lang="ts">
import {
  StorageType,
  useSoundsAndMusicStore
} from '@/logic/storage/sounds-and-music'
import { useTimerStore } from '@/logic/storage/timer'
import PartialAddEditPopup from './components/partial-add-edit-popup.vue'
const timerStore = useTimerStore()

const addEditPopupRef = ref<InstanceType<typeof PartialAddEditPopup>>()
const edit = ref(false)

const soundsAndMusicStore = useSoundsAndMusicStore()
function getSoundTitle (key: string | undefined): string | undefined {
  const sound = soundsAndMusicStore.get(StorageType.Sound, key)
  return sound?.name
}
</script>

<template>
  <div class="d-flex flex-wrap">
    <UiTimer
      v-for="timerKey in timerStore.getTimerKeys"
      :key="timerKey"
      v-model:pin="timerStore.timers[timerKey].isPinned"
      :time-current="timerStore.timersEvaluated[timerKey].timeCurrent"
      :play="timerStore.timers[timerKey].isPlaying"
      :title="timerStore.timers[timerKey].title"
      :edit="edit"
      class="pa-2"
      :time="timerStore.timers[timerKey].time"
      :ring-sound-name="getSoundTitle(timerStore.timers[timerKey].soundKey)"
      @play="timerStore.playTimer(timerKey)"
      @stop="timerStore.stopTimer(timerKey)"
      @close="timerStore.closeTimer(timerKey)"
      @reset="timerStore.resetTimer(timerKey)"
      @edit="addEditPopupRef?.open(timerKey)"
    />
    <PartialAddEditPopup ref="addEditPopupRef" :edit="edit" />
    <EditAddButtonsFloating
      v-model:edit="edit"
      :edit-disabled="timerStore.getTimerKeys.length === 0"
      :add-tooltip="$t('timers-page.add-new-timer')"
      :edit-tooltip="$t('timers-page.edit-timer')"
      :edit-finish-tooltip="$t('timers-page.finish-edit-timer')"
      @add="addEditPopupRef?.open()"
    />
  </div>
</template>

<route lang="yaml">
name: "Timers"
meta:
  layout: popup-default
</route>

<style></style>
