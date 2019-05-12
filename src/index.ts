
import { LocalDate } from 'js-joda'

import { Bday } from './bday'
import { Gender, Nnn} from './nnn'
import * as cc from './cc'
import * as century from './century'

export class ValidSsn {
  constructor(
    readonly bday: Bday,
    readonly nnn: Nnn,
    readonly control: string
  ) {}

  isFemale = () => this.nnn.isFemale()
  isMale = () => this.nnn.isMale()
  isTemporal = () => this.nnn.isTemporal()
  toString = () => `${this.bday}${this.bday.toCenturyId()}${this.nnn}${this.control}`
}

// -- GENERATOR

export const female = (date?: LocalDate) => generate(Nnn.generate(Gender.Female), date)
export const femaleTemporal = (date?: LocalDate) => generate(Nnn.generateTemporal(Gender.Female), date)
export const male = (date?: LocalDate) => generate(Nnn.generate(Gender.Male), date)
export const maleTemporal = (date?: LocalDate) => generate(Nnn.generateTemporal(Gender.Male), date)
export const generate = (nnn: Nnn, date: LocalDate = Bday.random()): ValidSsn => {
  const bday = Bday.from(date)
  const control = cc.from(bday, nnn)
  return new ValidSsn(bday, nnn, control)
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

export const parse = (candidate: string): ValidSsn => {
  const m = candidate.match(re)
  if (m == null) {
    throw Error('Invalid ssn: pattern mismatch')
  }

  const centuryId = century.parseId(m[Groups.century])
  const bday = Bday.parse(m[Groups.bday], centuryId)
  const nnn = Nnn.parse(m[Groups.nnn])
  const control = m[Groups.control]

  if (cc.from(bday, nnn) !== control) {
    throw new Error(`Invalid ssn: control char mismatch`)
  }

  return new ValidSsn(bday, nnn, control)
}
