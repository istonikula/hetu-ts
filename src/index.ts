
import { LocalDate } from 'js-joda'

import { Bday } from './bday'
import { Gender, Nnn} from './nnn'
import * as cc from './cc'
import * as century from './century'

export const female = (date: LocalDate = Bday.random()) => generate(date, Nnn.generate(Gender.Female))
export const femaleTemporal = (date: LocalDate = Bday.random()) => generate(date, Nnn.generateTemporal(Gender.Female))
export const male = (date: LocalDate = Bday.random()) => generate(date, Nnn.generate(Gender.Male))
export const maleTemporal = (date: LocalDate = Bday.random()) => generate(date, Nnn.generateTemporal(Gender.Male))
export const generate = (date: LocalDate = Bday.random(), nnn: Nnn): string => {
  const bday = Bday.from(date)
  const centuryId = bday.toCenturyId()
  const controlChar = cc.from(bday, nnn)
  return `${bday}${centuryId}${nnn}${controlChar}`
}

export interface ValidSsn {
  bday: Bday
  nnn: Nnn
  cc: string

  isFemale(): boolean
  isTemporal(): boolean
}


enum Groups {
  bday = 1,
  century = 2,
  nnn = 3,
  control = 4
}

export class Parser {
  private static pattern =
    '^' + // start
    '(.{6})' + // bday: ddMMyy
    '(.)' + // century id: - or A
    '(.{3})' + // nnn: three digits
    '(.)' + // control char
    '$' // end
  private static re = new RegExp(Parser.pattern)

  public static parse(candidate: string): ValidSsn {
    const m = candidate.match(Parser.re)
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

    return {
      bday,
      nnn,
      cc: control,
      isFemale: () => nnn.isFemale(),
      isTemporal: () => nnn.isTemporal(),
    }
  }
}

