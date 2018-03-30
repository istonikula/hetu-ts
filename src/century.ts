export type CenturyId =
  | A
  | Minus

export class A {
  static readonly tag = 'A'
  static readonly century = 2000

  century() { return A.century }
  toString() { return 'A' }
}

export class Minus {
  static readonly tag = 'Minus'
  static readonly century = 1900

  century() { return Minus.century }
  toString() { return '-' }
}

export function parse(century: number): CenturyId {
  switch (century) {
    case A.century: return new A()
    case Minus.century: return new Minus()
    default:
      throw new Error(`Unsupported century ${century}`)
  }
}

export function  parseId(id: string): CenturyId {
  switch(id.toLowerCase()) {
    case 'a': return new A()
    case '-': return new Minus()
    default:
      throw new Error(`Unsupported century id ${id}`)
  }
}