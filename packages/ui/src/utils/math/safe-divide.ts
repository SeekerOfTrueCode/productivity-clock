export function safeDivide (a: number, b: number): number {
  if (b === 0) { return 0 }
  return a / b
}
