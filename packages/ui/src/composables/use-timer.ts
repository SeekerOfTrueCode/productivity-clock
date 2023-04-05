import { type Ref, computed } from 'vue'
import { safeDivide } from '../utils/math/safe-divide'
import { timeStringToTimeObject } from '../utils/time/time-string-to-time-object'

interface UseTimerOptions {
  props: {
    pin?: boolean;
    title: string;
    play: boolean;
    time?: string;
    timeCurrent?: string;
    edit: boolean;
  }
  time?: Ref<string>;
  emit: (event: 'close' | 'reset' | 'play' | 'stop' | 'edit' | 'update:pin', ...args: any[]) => void
}

export function useTimer (options: UseTimerOptions) {
  const progress = computed(() => {
    if (options.props.time === options.props.timeCurrent) { return 0 } // if is played
    const { hours: tH, minutes: tM, seconds: tS } = timeStringToTimeObject(options.props.time ?? options.time?.value ?? '00:00:00')
    const { hours: tcH, minutes: tcM, seconds: tcS } = timeStringToTimeObject(options.props.timeCurrent ?? '00:00:00')
    const sumT = (tH * 60 * 60) + (tM * 60) + tS
    const sumTc = (tcH * 60 * 60) + (tcM * 60) + tcS
    const result = safeDivide(((sumT - sumTc) * 100), sumT)
    return 100 - result
  })

  const timerResetDisabled = computed(() => {
    return options.props.time === options.props.timeCurrent
  })

  function timerReset () {
    options.emit('reset')
  }
  function timerPlay () {
    options.emit('play')
  }
  function timerStop () {
    options.emit('stop')
  }
  function timerClose () {
    options.emit('close')
  }
  function timerPin () {
    options.emit('update:pin', !options.props.pin)
  }
  function editTimer () {
    if (options.props.edit) { options.emit('edit') }
  }

  return {
    progress,
    timerResetDisabled,
    timerPlay,
    timerReset,
    timerStop,
    timerClose,
    timerPin,
    editTimer
  }
}
