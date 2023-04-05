<script setup lang="ts">
import { useBackgroundMusicStore } from '@/logic/storage/background-music'
import { useDefaultTimerSoundStore } from '@/logic/storage/default-timer-sound'
import { useNotificationsStore } from '@/logic/storage/notifications'
import { useNowStore } from '@/logic/storage/now'
import { useSoundsAndMusicStore } from '@/logic/storage/sounds-and-music'
import { useTimerSessionStore } from '@/logic/storage/timer-session'
import { useTimerStore } from '@/logic/storage/timer'

const timerStore = useTimerStore()
const timerSessionStore = useTimerSessionStore()
const nowStore = useNowStore()
const soundsAndMusicStore = useSoundsAndMusicStore()
const backgroundMusicStore = useBackgroundMusicStore()
const defaultTimerSoundStore = useDefaultTimerSoundStore()
const notificationsStore = useNotificationsStore()
</script>

<template>
  <UiCard class="d-flex flex-column h-[490px]" style="overflow: visible;">
    <UiDivider />
    <div>
      {{ timerStore.timers }}
    </div>
    <UiDivider />
    <div>
      {{ timerStore.timersEvaluated }}
    </div>
    <UiDivider />
    <div>
      {{ nowStore.now }}
    </div>
    <UiDivider />
    <div>
      {{ soundsAndMusicStore.sounds }}
    </div>
    <div>
      {{ soundsAndMusicStore.music }}
    </div>
    <UiDivider />
    <div>
      {{ backgroundMusicStore.data }}
    </div>
    <UiDivider />
    <div>
      {{ defaultTimerSoundStore.data }}
    </div>
    <UiDivider />
    <div>
      {{ notificationsStore.notifications }}
    </div>
    <UiDivider />
    <div>
      {{ timerSessionStore.sessionTimersDynamic }}
    </div>
    <UiDivider />
    <div>
      {{ timerSessionStore.sessionTimersStatic }}
    </div>
    <UiDivider />
    <div>
      {{ timerSessionStore.sessionTimersEvaluated }}
    </div>
    <UiDivider />
  </UiCard>
</template>

<route lang="yaml">
name: "Debug"
meta:
  layout: popup-default
</route>
