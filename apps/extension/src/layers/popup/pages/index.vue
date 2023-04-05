<script setup lang="ts">
import {
  StorageType,
  useSoundsAndMusicStore
} from '@/logic/storage/sounds-and-music'
import { useTimerSessionStore } from '@/logic/storage/timer-session'
import { useTimerStore } from '@/logic/storage/timer'

const timerStore = useTimerStore()
const soundsAndMusicStore = useSoundsAndMusicStore()
function getSoundTitle (key: string | undefined): string | undefined {
  const sound = soundsAndMusicStore.get(StorageType.Sound, key)
  return sound?.name
}
const timerSessionStore = useTimerSessionStore()
const timerSessions = computed(() => {
  return timerSessionStore.sessionTimersKeys
    .map((key) => {
      return {
        key,
        dynamic: timerSessionStore.sessionTimersDynamic[key],
        static: timerSessionStore.sessionTimersStatic[key],
        evaluated: timerSessionStore.sessionTimersEvaluated[key]
      }
    })
    .filter(x => x.static.isPinned)
})
</script>

<template>
  <v-expansion-panels>
    <!-- FIXME: translate -->
    <v-expansion-panel title="Pinned timers">
      <template #text>
        <UiSlideGroup show-arrows>
          <UiSlideGroupItem
            v-for="timerKey in timerStore.getPinnedTimerKeys"
            :key="timerKey"
            v-slot="{ toggle }"
          >
            <UiTimer
              :pin="timerStore.timers[timerKey].isPinned"
              :time-current="timerStore.timersEvaluated[timerKey].timeCurrent"
              :play="timerStore.timers[timerKey].isPlaying"
              :title="timerStore.timers[timerKey].title"
              :edit="false"
              class="pa-2"
              :time="timerStore.timers[timerKey].time"
              :ring-sound-name="
                getSoundTitle(timerStore.timers[timerKey].soundKey)
              "
              @play="timerStore.playTimer(timerKey)"
              @stop="timerStore.stopTimer(timerKey)"
              @reset="timerStore.resetTimer(timerKey)"
              @click="toggle"
            />
          </UiSlideGroupItem>
        </UiSlideGroup>
      </template>
    </v-expansion-panel>
    <!--  -->
    <!-- FIXME: translate -->
    <v-expansion-panel title="Pinned session timers">
      <template #text>
        <UiSlideGroup show-arrows>
          <UiSlideGroupItem
            v-for="{
              key,
              dynamic: timerDynamic,
              static: timerStatic,
              evaluated,
            } in timerSessions"
            :key="key"
            v-slot="{ toggle }"
          >
            <UiTimerSession
              :key="key"
              :pin="timerStatic.isPinned"
              :time-current="evaluated.timeCurrent"
              :play="timerDynamic.isPlaying"
              :title="timerStatic.title"
              :edit="false"
              class="pa-2"
              :current-timer-index="timerDynamic.currentTimerIndex"
              :ring-sound-name="
                getSoundTitle(
                  timerStatic.timers[timerDynamic.currentTimerIndex]?.soundKey
                )
              "
              :timers="timerStatic.timers"
              @click="toggle"
              @play="timerSessionStore.playSessionTimer(key)"
              @stop="timerSessionStore.stopSessionTimer(key)"
              @reset="timerSessionStore.resetSessionTimer(key)"
            />
          </UiSlideGroupItem>
        </UiSlideGroup>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<route lang="yaml">
name: "Home"
meta:
  layout: popup-default
</route>
