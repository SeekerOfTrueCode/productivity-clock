<script setup lang="ts">
import {
  StorageType,
  useSoundsAndMusicStore
} from '@/logic/storage/sounds-and-music'
import { useTimerSessionStore } from '@/logic/storage/timer-session'
import PartialAddEditPopup from './components/partial-add-edit-popup.vue'
import PartialEditStepPopup from './components/partial-edit-step-popup.vue'

const addEditPopupRef = ref<InstanceType<typeof PartialAddEditPopup>>()
const editStepPopupRef = ref<InstanceType<typeof PartialEditStepPopup>>()

const timerSessionStore = useTimerSessionStore()
const soundsAndMusicStore = useSoundsAndMusicStore()

const edit = ref(false)

function getSoundTitle (key: string | undefined): string | undefined {
  const sound = soundsAndMusicStore.get(StorageType.Sound, key)
  return sound?.name
}

const timerSessions = computed(() => {
  return timerSessionStore.sessionTimersKeys.map((key) => {
    return {
      key,
      dynamic: timerSessionStore.sessionTimersDynamic[key],
      static: timerSessionStore.sessionTimersStatic[key],
      evaluated: timerSessionStore.sessionTimersEvaluated[key]
    }
  })
})
</script>

<template>
  <div class="d-flex flex-wrap">
    <UiTimerSession
      v-for="{
        key,
        dynamic: timerDynamic,
        static: timerStatic,
        evaluated,
      } in timerSessions"
      :key="key"
      v-model:pin="timerStatic.isPinned"
      :time-current="evaluated.timeCurrent"
      :play="timerDynamic.isPlaying"
      :title="timerStatic.title"
      :edit="edit"
      class="pa-2"
      :current-timer-index="timerDynamic.currentTimerIndex"
      :ring-sound-name="
        getSoundTitle(
          timerStatic.timers[timerDynamic.currentTimerIndex]?.soundKey
        )
      "
      :timers="timerStatic.timers"
      @play="timerSessionStore.playSessionTimer(key)"
      @stop="timerSessionStore.stopSessionTimer(key)"
      @close="timerSessionStore.removeSessionTimer(key)"
      @reset="timerSessionStore.resetSessionTimer(key)"
      @edit="addEditPopupRef?.open(key)"
      @edit-step="(timer) => editStepPopupRef?.open(key, timer)"
    />
    <PartialAddEditPopup ref="addEditPopupRef" :edit="edit" />
    <PartialEditStepPopup ref="editStepPopupRef" :edit="edit" />

    <EditAddButtonsFloating
      v-model:edit="edit"
      :edit-disabled="timerSessions.length === 0"
      :add-tooltip="$t('productivity-sessions-page.add-new-timer')"
      :edit-tooltip="$t('productivity-sessions-page.edit-timer')"
      :edit-finish-tooltip="$t('productivity-sessions-page.finish-edit-timer')"
      @add="addEditPopupRef?.open()"
    />
  </div>
</template>

<route lang="yaml">
name: "Productivity sessions"
meta:
  layout: popup-default
</route>

<style></style>
