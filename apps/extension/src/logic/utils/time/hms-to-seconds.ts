export function hmsToSeconds (hms: string) {
  const [hours, minutes, seconds] = hms.split(':')
  return (+hours * 60 * 60) + (+minutes * 60) + +seconds
}
