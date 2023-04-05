export function round (num: number, decimal: number) {
  const by = 10 ** decimal
  return Math.round(num * by) / by
}
