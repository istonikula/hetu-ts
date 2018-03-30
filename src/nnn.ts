import * as random from './random'

// spec: three digits between 002-899. 900-999 used for temporal ssns
// female: even
// male: odd
export default class Nnn {
  constructor(readonly value: number) {}

  isFemale() { return Nnn.isFemale(this.value) }
  isMale() { return Nnn.isMale(this.value) }
  isTemporal() { return Nnn.isTemporal(this.value) }
  toString() { return ('00' + this.value).slice(-3) }

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

  static isFemale(x: number) { return x % 2 !== 0 }
  static isMale(x: number) { return x % 2 === 0 }
  static isReal(x: number) { return 2 <= x && x <= 899 }
  static isTemporal(x: number) { return 900 <= x && x <= 999 }
}

export enum Gender {
  Female,
  Male
}

