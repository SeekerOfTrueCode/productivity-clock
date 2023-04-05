import { defineStore } from 'pinia'
import { diffInSeconds } from '@/logic/utils/time/diff-in-seconds'
import { elapsedTimeToHms } from '@/logic/utils/time/hms-format-clock-hms'
import { hmsToSeconds } from '@/logic/utils/time/hms-to-seconds'
import { round } from '../utils/math/round'
import { useEvents } from '@/composables/use-events'
import { useNowStore } from './now'

type TimeSessionKey = string;

interface AddSessionTimerSchema {
  title: string;
  timeSession: string;
  timeBreak: string;
  steps: number;
  soundKey?: string;
  soundBreakKey?: string;
}

export interface TimeSchema {
  id: number;

  title: string;
  time: string;
  soundKey?: string;
}

export interface TimerSessionStaticSchema {
  title: string;
  isPinned: boolean;
  timers: TimeSchema[];
}
export interface TimerSessionDynamicSchema {
  isPlaying: boolean;
  playTimestamps: (string | number)[];
  stopTimestamps: (string | number)[];
  currentTimerIndex: number;
}

type TimeSessionStorageDynamicSchema = Record<TimeSessionKey, TimerSessionDynamicSchema>
type TimeStorageStorageStaticSchema = Record<TimeSessionKey, TimerSessionStaticSchema>

export interface StorageEvalSchema {
  elapsed: number;
  remained: number;
  isFinished: boolean;
  timeCurrent: string;
}

export enum Events {
  Finished = 'finished'
}

type EventCallback = (key: string, timerDynamic: TimerSessionDynamicSchema, timerStatic: TimerSessionStaticSchema) => void

export const useTimerSessionStore = defineStore('timer-session', () => {
  const nowStore = useNowStore()
  const events = useEvents<Events, EventCallback>()

  const sessionTimersDynamic = ref<TimeSessionStorageDynamicSchema>({})
  const sessionTimersStatic = ref<TimeStorageStorageStaticSchema>({})

  const sessionTimersKeys = computed(() => Object.keys(sessionTimersStatic.value))

  function editSessionTimer (timerKey: string, timer: AddSessionTimerSchema) {
    const allSteps = (timer.steps * 2) - 1
    const timers = [...Array(allSteps).keys()]
      .map(x => ({
        id: x,

        title: x % 2 ? 'Break' : 'Timer',
        time: x % 2 ? timer.timeBreak : timer.timeSession,
        soundKey: x % 2 ? timer.soundBreakKey : timer.soundKey
      }))

    sessionTimersStatic.value[timerKey] = {
      title: timer.title,
      isPinned: false,
      timers
    }
    sessionTimersDynamic.value[timerKey] = {
      isPlaying: false,
      playTimestamps: [],
      stopTimestamps: [],
      currentTimerIndex: 0
    }
  }

  function addSessionTimer (timer: AddSessionTimerSchema) {
    const sessionTimerKey = Object.keys(sessionTimersDynamic.value).at(-1)
    const newSessionTimerKey = `${sessionTimerKey == null ? 0 : +sessionTimerKey + 1}`
    editSessionTimer(newSessionTimerKey, timer)
  }

  function editSessionTimerStep (timerKey: string, stepId: number, timer: TimeSchema) {
    const stepTimer = sessionTimersStatic.value[timerKey]?.timers?.[stepId] ?? undefined
    if (stepTimer == null) { return }
    stepTimer.title = timer.title
    stepTimer.time = timer.time
    stepTimer.soundKey = timer.soundKey
  }

  function removeSessionTimer (key?: string | null) {
    if (key == null) { return }
    delete sessionTimersDynamic.value[key]
    delete sessionTimersStatic.value[key]
  }

  function resetSessionTimerSoft (key?: string | null) {
    if (key == null) { return }
    const sessionTimer = sessionTimersDynamic.value[key]
    if (sessionTimer == null) { return }

    sessionTimer.playTimestamps = []
    sessionTimer.stopTimestamps = []
    return sessionTimer
  }

  function resetSessionTimer (key?: string | null) {
    const sessionTimer = resetSessionTimerSoft(key)
    if (sessionTimer == null) { return }
    sessionTimer.currentTimerIndex = 0
  }

  function playSessionTimer (key?: string | null) {
    if (key == null) { return }
    const sessionTimer = sessionTimersDynamic.value[key]
    const sessionTimerStatic = sessionTimersStatic.value[key]
    const sessionTimerEval = sessionTimersEvaluated.value[key]
    if (sessionTimer == null || sessionTimerEval == null) { return }
    sessionTimer.isPlaying = true

    if (sessionTimerEval.isFinished && sessionTimer.currentTimerIndex === sessionTimerStatic.timers.length - 1) {
      resetSessionTimer(key)
    } else if (sessionTimerEval.isFinished) {
      resetSessionTimerSoft(key)
    }

    if (sessionTimer.playTimestamps.length === sessionTimer.stopTimestamps.length) { sessionTimer.playTimestamps.push(Date.now()) }
  }

  function stopSessionTimer (key?: string | null) {
    if (key == null) { return }
    const sessionTimer = sessionTimersDynamic.value[key]
    const sessionTimerEval = sessionTimersEvaluated.value[key]
    if (sessionTimer == null || sessionTimerEval == null) { return }
    sessionTimer.isPlaying = false

    if (sessionTimerEval.isFinished) {
      resetSessionTimer(key)
    }

    if (sessionTimer.playTimestamps.length > sessionTimer.stopTimestamps.length) { sessionTimer.stopTimestamps.push(Date.now()) }
  }

  //

  function calcElapsedDeltaStartAndStop (timer: TimerSessionDynamicSchema): number {
    return timer.stopTimestamps
      .map((stop, i) => diffInSeconds(timer.playTimestamps[i], stop))
      .reduce((prevTime, sum) => sum + prevTime, 0)
  }

  function calcElapsedDeltaStopAndNow (timer: TimerSessionDynamicSchema): number {
    let elapsedDeltaStopAndNow = 0
    if (timer.isPlaying) {
      const timestamp = timer.playTimestamps?.at(timer.playTimestamps.length - 1)
      const lastPlayTimeStamp = timestamp ?? nowStore.now
      elapsedDeltaStopAndNow = diffInSeconds(lastPlayTimeStamp, nowStore.now)
    }
    return elapsedDeltaStopAndNow
  }

  //

  const sessionTimersEvaluated = computed<Record<string, StorageEvalSchema>>(() => {
    const elapsedDeltaStartAndStop = sessionTimersKeys.value.map((key) => {
      const sessionTimerDynamic = sessionTimersDynamic.value[key]
      const sessionTimerStatic = sessionTimersStatic.value[key]

      const timer = sessionTimerStatic.timers?.[sessionTimerDynamic.currentTimerIndex] ?? { time: '00:00:00' }
      const timerHms = hmsToSeconds(timer.time)
      const elapsedDeltaStartAndStop = calcElapsedDeltaStartAndStop(sessionTimerDynamic)
      const elapsedDeltaStopAndNow = calcElapsedDeltaStopAndNow(sessionTimerDynamic)
      const elapsed = Math.min(round(elapsedDeltaStartAndStop + elapsedDeltaStopAndNow, 2), timerHms)

      const remained = round(timerHms - elapsed, 2)
      const isFinished = remained <= 0

      const timeCurrent = elapsedTimeToHms(remained ?? 0)

      return [key, {
        elapsed,
        remained,
        isFinished,
        timeCurrent
      }]
    })
    return Object.fromEntries(elapsedDeltaStartAndStop)
  }, {})

  watch(() => sessionTimersEvaluated.value, (value) => {
    Object.entries(value)
      .map<[string, StorageEvalSchema, TimerSessionDynamicSchema, TimerSessionStaticSchema]>(([key, x]) => [key, x, sessionTimersDynamic.value[key], sessionTimersStatic.value[key]])
      .filter(([_key, x, y]) => x.isFinished && y.isPlaying)
      .forEach(async ([key, _x, y, z]) => {
        y.isPlaying = false
        if (y.playTimestamps.length > y.stopTimestamps.length) { y.stopTimestamps.push(Date.now()) }
        events.events.value?.[Events.Finished]?.(key, y, z)
        resetSessionTimerSoft(key)
        y.currentTimerIndex = (y.currentTimerIndex + 1) % z.timers.length

        if (y.currentTimerIndex !== 0) {
          await nextTick()
          await nextTick()
          playSessionTimer(key)
        }
      })
  }, { deep: true })

  return {
    sessionTimersKeys,
    sessionTimersStatic,
    sessionTimersDynamic,
    editSessionTimer,
    addSessionTimer,
    editSessionTimerStep,
    removeSessionTimer,
    resetSessionTimer,
    playSessionTimer,
    stopSessionTimer,

    sessionTimersEvaluated,

    addEventListener: events.addEventListener,
    removeEventListener: events.removeEventListener
  }
}, {
  persistedState: { persist: true }
})
