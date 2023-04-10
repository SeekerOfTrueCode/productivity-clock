<script setup lang="ts">
import { useTimer } from '../../composables/use-timer'
import PartialTimerFooter from './partials/timer-footer.vue'
import PartialTimerHeader from './partials/timer-header.vue'
import PartialTimerSessionStep from './partials/timer-session-step.vue'
import PartialTimerTime from './partials/timer-time.vue'
// import UiBtn from '../buttons/btn.vue'
import { computed } from 'vue'
import { elapsedTimeToHms } from '../../utils/time/hms-format-clock-hms'
import { hmsToSeconds } from '../../utils/time/hms-to-seconds'
import UiDivider from '../dividers/divider.vue'
// import UiIcon from '../icons/icon.vue'

function convertRemToPixels (rem: number) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

const props = withDefaults(
  defineProps<{
    pin: boolean;
    title: string;
    play: boolean;
    timeCurrent?: string;
    edit: boolean;
    ringSoundName: string;
    currentTimerIndex: number;
    timers: { id: number; title: string; time: string }[];
  }>(),
  {
    play: false,
    timeCurrent: '00:00:00',
    currentTimerIndex: 0,
    timers: () => [],
    ringSoundName: undefined
  }
)

const emit = defineEmits([
  'close',
  'reset',
  'play',
  'stop',
  'edit',
  'edit-step',
  'update:pin'
])

const timer = computed(() => props.timers?.[props.currentTimerIndex])
const time = computed(() => timer.value?.time ?? '00:00:00')

const {
  progress,
  timerResetDisabled,
  timerPlay,
  timerReset,
  timerStop,
  timerClose,
  timerPin,
  editTimer
} = useTimer({ props, emit, time })

const timersCount = computed(() => props.timers.length)
const stepsCount = computed(() => Math.ceil(timersCount.value / 2))
const currentStep = computed(() => Math.ceil((timer.value.id + 1) / 2))
const isCurrentStepABreak = computed(() => timer.value.id % 2)
const stepProgress = computed(() => {
  const percentageOfStep = (currentStep.value / stepsCount.value) * 100
  const rangeOfSingleStep = 100 / stepsCount.value
  const currentStepProgress = (progress.value * rangeOfSingleStep) / 100

  return (
    percentageOfStep - (isCurrentStepABreak.value ? 0 : currentStepProgress)
  )
})
const timeSum = computed(() =>
  elapsedTimeToHms(
    props.timers
      .map(x => hmsToSeconds(x.time))
      .reduce((next, acc) => acc + next, 0)
  )
)
</script>

<template>
  <div class="d-inline-block">
    <v-card
      :style="{ width: `31rem`, height: `15rem` }"
      class="d-flex flex-column"
      :link="edit"
      @click="editTimer"
    >
      <header class="d-flex align-center justify-center pa-1">
        <v-chip label size="small">
          {{
            $vuetify.locale.t("$vuetify.timer-session-step.total-time", timeSum)
          }}
        </v-chip>
        <PartialTimerHeader
          :pin="pin"
          :title="`${title} - ${timer.title}`"
          :ring-sound-name="ringSoundName"
          :edit="edit"
          @pin="timerPin"
          @close="timerClose"
        />
      </header>

      <UiDivider />

      <div class="d-flex flex-1" style="overflow: hidden">
        <div class="d-flex flex-column">
          <v-progress-linear :model-value="stepProgress" height="20">
            <strong class="shadow-outline">{{
              $vuetify.locale.t(
                "$vuetify.timer-session-step.step-advanced",
                currentStep,
                stepsCount,
                isCurrentStepABreak
                  ? `- ${$vuetify.locale.t(
                    "$vuetify.timer-session-step.break"
                  )}`
                  : ""
              )
            }}</strong>
          </v-progress-linear>

          <PartialTimerTime
            style="flex: 1"
            :model-value="progress"
            :size="convertRemToPixels(6.25)"
            :time-current="timeCurrent"
          />
        </div>
        <v-divider vertical />
        <div
          class="flex-1 d-flex flex-wrap pa-4"
          style="height: 100%; overflow-y: auto; gap: 0.5rem"
        >
          <PartialTimerSessionStep
            v-for="(_timer, i) in timers"
            :key="_timer.id"
            :edit="edit"
            :step="i % 2 ? 'break' : i / 2"
            :active="i === currentTimerIndex"
            :step-count="stepsCount"
            :title="_timer.title"
            :time="_timer.time"
            @edit="$emit('edit-step', _timer)"
          />
        </div>
      </div>

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

<style scoped>
.shadow-outline {
  text-shadow: 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface)), 0 0 1px rgb(var(--v-theme-surface)),
    0 0 1px rgb(var(--v-theme-surface));
}
</style>
