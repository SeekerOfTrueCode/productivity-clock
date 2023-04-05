export interface TimeObject {
    hours: number;
    minutes: number;
    seconds: number;
}

export function timeStringToTimeObject (time: string): TimeObject {
  const [hours, minutes, seconds] = time?.split(':') ?? [0, 0, 0]

  return {
    hours: +hours,
    minutes: +minutes,
    seconds: +seconds
  }
}
