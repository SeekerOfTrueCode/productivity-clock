import { secondsToHms } from './seconds-to-hms'

export function isDigit (val: string): boolean {
  // eslint-disable-next-line eqeqeq
  return String(+val).charAt(0) == val
}
export function ensureDoubleDigit (number: number) {
  return isDigit(number as any) ? `0${number}` : number
}

export function hmsFormatClockHms (hours: number, minutes: number, seconds: number) {
  return `${ensureDoubleDigit(hours)}:${ensureDoubleDigit(minutes)}:${ensureDoubleDigit(seconds)}`
}

export function elapsedTimeToHms (difference: number) {
  const { hours, minutes, seconds } = secondsToHms(difference)
  return hmsFormatClockHms(hours, minutes, seconds)
}
