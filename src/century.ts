export type CenturyId =
  | A
  | Minus

export class A {
  static readonly tag = 'A'
  static readonly century = 2000

  century = () => A.century
  toString = () => 'A'
}

export class Minus {
  static readonly tag = 'Minus'
  static readonly century = 1900

  century = () => Minus.century
  toString = () => '-'
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
  switch(id) {
    case 'A': return new A()
    case '-': return new Minus()
    default:
      throw new Error(`Unsupported century id ${id}`)
  }
}