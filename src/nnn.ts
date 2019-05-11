import * as random from './random'

// spec: three digits between 002-899. 900-999 used for temporal ssns
// female: even
// male: odd
export default class Nnn {
  constructor(readonly value: number) {}

  isFemale = () => Nnn.isFemale(this.value)
  isMale = () => Nnn.isMale(this.value)
  isTemporal = () => Nnn.isTemporal(this.value)
  toString = () => ('00' + this.value).slice(-3)

  static parse(s: string) {
    const i = parseInt(s, 10)
    if (Nnn.isReal(i) || Nnn.isTemporal(i)) return new Nnn(i)
    throw new Error(`Invalid nnn: ${s}`)
  }

  static generate = Nnn.gen(2, 899)
  static generateTemporal = Nnn.gen(900, 999)

  private static gen(start: number, end: number) {
    return (gender: Gender) => {
      while (true) {
        const candidate = random.fromRange(start, end)
        switch(gender) {
          case Gender.Female:
            if (Nnn.isFemale(candidate)) return new Nnn(candidate)
            continue
          case Gender.Male:
            if (Nnn.isMale(candidate)) return new Nnn(candidate)
            continue
        }
      }
    }
  }

  static isFemale = (x: number) => x % 2 === 0
  static isMale = (x: number) => x % 2 !== 0
  static isReal = (x: number) => 2 <= x && x <= 899
  static isTemporal= (x: number) => 900 <= x && x <= 999
}

export enum Gender {
  Female,
  Male
}

