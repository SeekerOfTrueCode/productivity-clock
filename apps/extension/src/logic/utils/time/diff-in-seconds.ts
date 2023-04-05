export function diffInSeconds (fromDateTimestamp: string | number | Date, toDateTimestamp: string | number | Date): number {
  const t1 = new Date(fromDateTimestamp)
  const t2 = new Date(toDateTimestamp)
  const dif = t2.getTime() - t1.getTime()
  return dif / 1000
}
