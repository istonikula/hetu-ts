export function fromRange(start: number, end: number) {
  return Math.floor(Math.random() * (end - start) + start)
}