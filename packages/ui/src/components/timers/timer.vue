<script setup lang="ts">
import { useTimer } from '../../composables/use-timer'
import PartialTimerFooter from './partials/timer-footer.vue'
import PartialTimerHeader from './partials/timer-header.vue'
import PartialTimerTime from './partials/timer-time.vue'
import UiDivider from '../dividers/divider.vue'

function convertRemToPixels (rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

const props = withDefaults(
  defineProps<{
    pin: boolean;
    title: string;
    play: boolean;
    time: string;
    timeCurrent?: string;
    edit: boolean;
    ringSoundName?: string;
  }>(),
  {
    play: false,
    time: '00:00:00',
    timeCurrent: '00:00:00',
    ringSoundName: undefined
  }
)
const emit = defineEmits([
  'close',
  'reset',
  'play',
  'stop',
  'edit',
  'update:pin'
])

const {
  progress,
  timerResetDisabled,
  timerPlay,
  timerReset,
  timerStop,
  timerClose,
  timerPin,
  editTimer
} = useTimer({ props, emit })
</script>

<template>
  <div class="d-inline-block">
    <v-card
      :style="{ width: `14rem`, height: `14rem` }"
      class="d-flex flex-column"
      :link="edit"
      @click="editTimer"
    >
      <header class="d-flex align-center justify-center pa-1">
        <PartialTimerHeader
          :pin="pin"
          :title="title"
          :edit="edit"
          :ring-sound-name="ringSoundName"
          @pin="timerPin"
          @close="timerClose"
        />
      </header>

      <UiDivider />

      <PartialTimerTime
        class="flex-1"
        :model-value="progress"
        :size="convertRemToPixels(6.25)"
        :time-current="timeCurrent"
      />

      <UiDivider />

      <footer class="d-flex align-center justify-center pa-1">
        <PartialTimerFooter
          :play="play"
          :edit="edit"
          :reset-disabled="timerResetDisabled"
          @play="timerPlay"
          @pause="timerStop"
          @reset="timerReset"
        />
      </footer>
    </v-card>
  </div>
</template>

<style>
.timer-title {
  width: 80px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-align: start;
}
</style>
