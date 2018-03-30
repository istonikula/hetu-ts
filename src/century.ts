export type CenturyId =
  | A
  | Minus

export class A {
  static readonly tag = 'A'
  static readonly century = 2000

  toString() { return 'A' }
}

export class Minus {
  static readonly tag = 'Minus'
  static readonly century = 1900

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