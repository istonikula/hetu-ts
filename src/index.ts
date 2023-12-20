
import { LocalDate } from 'js-joda'

import { Bday } from './bday'
import { Century } from './century'
import { Gender, Nnn} from './nnn'
import * as cc from './cc'
import * as Result from './result'

export {
  Result
}

export class ValidSsn {
  readonly value: string

  constructor(
    readonly bday: Bday,
    readonly century: Century,
    readonly nnn: Nnn,
    readonly control: string
  ) {
    this.value = `${this.bday}${this.century}${this.nnn}${this.control}`
  }

  isFemale = () => this.nnn.isFemale()
  isMale = () => this.nnn.isMale()
  isTemporal = () => this.nnn.isTemporal()
  toString = () => this.value
}

// -- GENERATOR

export const female = (date?: LocalDate) => generate(Nnn.generate(Gender.Female), date)
export const femaleTemporal = (date?: LocalDate) => generate(Nnn.generateTemporal(Gender.Female), date)
export const male = (date?: LocalDate) => generate(Nnn.generate(Gender.Male), date)
export const maleTemporal = (date?: LocalDate) => generate(Nnn.generateTemporal(Gender.Male), date)
// NOTE: generates '-' and 'A' century ids only
export const generate = (nnn: Nnn, date: LocalDate = Bday.random()): ValidSsn => {
  const bday = Bday.from(date)
  const control = cc.from(bday, nnn)
  const century = bday.century() === 1900 ? new Century('-', 1900) : new Century('A', 2000)
  return new ValidSsn(bday, century, nnn, control)
}

// -- PARSER

enum Groups {
  bday = 1,
  century = 2,
  nnn = 3,
  control = 4
}

const pattern =
  '^' + // start
  '(.{6})' + // bday: ddMMyy
  '(.)' + // century id: - or A
  '(.{3})' + // nnn: three digits
  '(.)' + // control char
  '$' // end
const re = new RegExp(pattern)

export const parse = (candidate: string): Result.Type<ValidSsn> => {
  try {
    const m = candidate.match(re)
    if (m == null) {
      throw new Error('Invalid ssn: pattern mismatch')
    }

    const century = Century.parse(m[Groups.century])
    const bday = Bday.parse(m[Groups.bday], century)
    const nnn = Nnn.parse(m[Groups.nnn])
    const control = m[Groups.control]

    if (cc.from(bday, nnn) !== control) {
      throw new Error(`Invalid ssn: control char mismatch`)
    }

    return new ValidSsn(bday, century, nnn, control)
  } catch (e) {
    return e as Error
  }
}
