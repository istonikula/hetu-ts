export class Century {
  constructor(
    readonly id: string,
    readonly value: number
  ) {
    this.id = id
    this.value = value
  }

  toString = () => this.id

  static parse = (id: string): Century => {
    if (isCenturyId(id)) return centuries[id]
    throw new Error(`Unsupported century id ${id}`)  
  }
}

function isCenturyId(candidate: string): candidate is CenturyId {
  return ids.includes(candidate as CenturyId)
}

const ids1900 = ['-', 'Y', 'X', 'W', 'V', 'U'] as const
const ids2000 = ['A', 'B', 'C', 'D', 'E', 'F'] as const
const ids = [...ids1900, ...ids2000] as const
type CenturyId = typeof ids[number]

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const centuries: Record<CenturyId, Century> = Object.fromEntries([
  ...ids1900.map(id => [id, new Century(id, 1900)]),
  ...ids2000.map(id => [id, new Century(id, 2000)]),
])