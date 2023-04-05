<script setup lang="ts">
import '@/styles'
import { usePinnedStore } from '@/logic/storage/pinned'
import { useTimerSessionStore } from '@/logic/storage/timer-session'
import { useTimerStore } from '@/logic/storage/timer'
const timerStore = useTimerStore()
const timerSessionStore = useTimerSessionStore()
const pinnedStore = usePinnedStore()

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
  <div
    class="fixed right-0 top-0 m-5 flex flex-column items-end font-sans select-none leading-1em opacity-75 pointer-events-none"
    style="z-index: 99999"
  >
    <!-- <UiApp style="position: relative; background-color: transparent !important;">
      <UiMain> -->
    <template v-if="pinnedStore.tabPagePinned">
      <UiTimerMiniature
        v-for="{
          key,
          dynamic: timerDynamic,
          static: timerStatic,
          evaluated,
        } in timerSessions"
        :key="key"
        :time-current="evaluated.timeCurrent"
        :time="timerStatic.timers[timerDynamic.currentTimerIndex]?.time"
        :play="timerDynamic.isPlaying"
        :title="`${timerStatic.title} - ${
          timerStatic.timers[timerDynamic.currentTimerIndex]?.title
        }`"
        :edit="false"
        :current-timer-index="timerDynamic.currentTimerIndex"
        class="pa-2 mb-2 bg-neutral-800 text-slate-100"
        @play="timerSessionStore.playSessionTimer(key)"
        @stop="timerSessionStore.stopSessionTimer(key)"
        @close="timerSessionStore.removeSessionTimer(key)"
        @reset="timerSessionStore.resetSessionTimer(key)"
      />
      <UiTimerMiniature
        v-for="timerKey in timerStore.getPinnedTimerKeys"
        :key="timerKey"
        :time-current="timerStore.timersEvaluated[timerKey].timeCurrent"
        :play="timerStore.timers[timerKey].isPlaying"
        :title="timerStore.timers[timerKey].title"
        :edit="false"
        class="pa-2 mb-2 bg-neutral-800 text-slate-100"
        :time="timerStore.timers[timerKey].time"
        @play="timerStore.playTimer(timerKey)"
        @stop="timerStore.stopTimer(timerKey)"
        @close="timerStore.closeTimer(timerKey)"
        @reset="timerStore.resetTimer(timerKey)"
      />
    </template>
    <!-- </UiMain>
    </UiApp> -->
  </div>
</template>

<style>
:root {
  color-scheme: light !important;
}
</style>
