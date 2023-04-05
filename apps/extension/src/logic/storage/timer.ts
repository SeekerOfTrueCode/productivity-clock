import { defineStore } from 'pinia'
import { diffInSeconds } from '@/logic/utils/time/diff-in-seconds'
import { elapsedTimeToHms } from '@/logic/utils/time/hms-format-clock-hms'
import { hmsToSeconds } from '@/logic/utils/time/hms-to-seconds'
import { round } from '../utils/math/round'
import { useEvents } from '@/composables/use-events'
import { useNowStore } from './now'

export interface StorageSchema {
  title: string;
  isPlaying: boolean;
  isPinned: boolean;
  time: string;
  playTimestamps: (string | number)[];
  stopTimestamps: (string | number)[];
  soundKey?: string;
}

export interface StorageEvalSchema {
  elapsed: number;
  remained: number;
  isFinished: boolean;
  timeCurrent: string;
}

export enum Events {
  Finished = 'finished'
}

type EventCallback = (key: string, timer: StorageSchema) => void

export const useTimerStore = defineStore('timer', () => {
  const nowStore = useNowStore()
  const events = useEvents<Events, EventCallback>()

  const timers = ref<Record<string, StorageSchema>>({})
  const getTimerKeys = computed(() => {
    return Object.keys(timers.value)
  })
  const getPinnedTimerKeys = computed(() => {
    return Object.entries(timers.value).filter(x => x[1].isPinned).map(x => x[0])
  })

  function setTimer (key: string, timer: StorageSchema) {
    timers.value[key] = timer
  }

  function addTimer (timer: { title: string; time: string; soundKey?: string; }) {
    const timerKey = getTimerKeys.value.at(-1)
    setTimer(`${timerKey == null ? 0 : +timerKey + 1}`, {
      title: timer.title,
      time: timer.time,
      soundKey: timer.soundKey,
      playTimestamps: [],
      stopTimestamps: [],
      isPlaying: false,
      isPinned: false
    })
  }

  function getTimer (key: string) {
    return timers.value[key]
  }
  function removeTimer (key?: string | null) {
    if (key == null) { return }
    delete timers.value[key]
  }

  function resetTimer (key?: string | null) {
    if (key == null) { return }
    const timer = getTimer(key)
    if (timer == null) { return }

    timer.playTimestamps = []
    timer.stopTimestamps = []
  }

  function playTimer (key?: string | null) {
    if (key == null) { return }
    const timer = getTimer(key)
    const timerEval = getTimerEvaluated(key)
    if (timer == null || timerEval == null) { return }
    timer.isPlaying = true

    if (timerEval.isFinished) {
      resetTimer(key)
    }

    if (timer.playTimestamps.length === timer.stopTimestamps.length) { timer.playTimestamps.push(Date.now()) }
  }

  function stopTimer (key?: string | null) {
    if (key == null) { return }
    const timer = getTimer(key)
    const timerEval = getTimerEvaluated(key)
    if (timer == null || timerEval == null) { return }
    timer.isPlaying = false

    if (timerEval.isFinished) {
      resetTimer(key)
    }

    if (timer.playTimestamps.length > timer.stopTimestamps.length) { timer.stopTimestamps.push(Date.now()) }
  }

  //

  function calcElapsedDeltaStartAndStop (timer: StorageSchema): number {
    return timer.stopTimestamps
      .map((stop, i) => diffInSeconds(timer.playTimestamps[i], stop))
      .reduce((prevTime, sum) => sum + prevTime, 0)
  }

  function calcElapsedDeltaStopAndNow (timer: StorageSchema): number {
    let elapsedDeltaStopAndNow = 0
    if (timer.isPlaying) {
      const timestamp = timer.playTimestamps?.at(timer.playTimestamps.length - 1)
      const lastPlayTimeStamp = timestamp ?? nowStore.now
      elapsedDeltaStopAndNow = diffInSeconds(lastPlayTimeStamp, nowStore.now)
    }
    return elapsedDeltaStopAndNow
  }

  //

  const timersEvaluated = computed<Record<string, StorageEvalSchema>>(() => {
    const elapsedDeltaStartAndStop = getTimerKeys.value.map((key) => {
      const timer = getTimer(key)
      const timerHms = hmsToSeconds(timer.time)
      const elapsedDeltaStartAndStop = calcElapsedDeltaStartAndStop(timer)
      const elapsedDeltaStopAndNow = calcElapsedDeltaStopAndNow(timer)
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

  watch(() => timersEvaluated.value, (value) => {
    Object.entries(value)
      .map<[string, StorageEvalSchema, StorageSchema]>(([key, x]) => [key, x, getTimer(key)])
      .filter(([_key, x, y]) => x.isFinished && y.isPlaying)
      .forEach(([key, _x, y]) => {
        y.isPlaying = false
        if (y.playTimestamps.length > y.stopTimestamps.length) { y.stopTimestamps.push(Date.now()) }
        events.events.value?.[Events.Finished]?.(key, y)
      })
  }, { deep: true })

  function getTimerEvaluated (key: string): StorageEvalSchema {
    return timersEvaluated.value[key]
  }

  return {
    timers,
    timersEvaluated,
    getTimerKeys,
    getPinnedTimerKeys,
    setTimer,
    addTimer,
    getTimer,
    getTimerEvaluated,
    closeTimer: removeTimer,
    resetTimer,
    playTimer,
    stopTimer,

    addEventListener: events.addEventListener,
    removeEventListener: events.removeEventListener
  }
}, {
  persistedState: { persist: true }
})
