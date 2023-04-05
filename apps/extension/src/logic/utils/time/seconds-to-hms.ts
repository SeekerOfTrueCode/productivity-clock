export function secondsToHms (totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60)

  const seconds = Math.floor(totalSeconds % 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)

  return { hours, minutes, seconds }
}
