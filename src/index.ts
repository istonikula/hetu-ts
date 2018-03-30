
import { Moment } from 'moment'

import Bday from './bday'
import Nnn, { Gender} from './nnn'
import * as cc from './cc'
import * as century from './century'

export const female = (date: Moment = Bday.random()) => generate(date, Nnn.generate(Gender.Female))
export const femaleTemporal = (date: Moment = Bday.random()) => generate(date, Nnn.generateTemporal(Gender.Female))
export const male = (date: Moment = Bday.random()) => generate(date, Nnn.generate(Gender.Male))
export const maleTemporal = (date: Moment = Bday.random()) => generate(date, Nnn.generateTemporal(Gender.Male))
export const generate = (date: Moment = Bday.random(), nnn: Nnn): string => {
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
    '^' +               // start
    '(\\d{6})' +        // bday: DDMMYY
    '([-aA])' +         // century id: -, a or A
    '(\\d{3})' +        // nnn: three digits
    '([\\da-yA-Y])' +   // control char
    "$"                 // end

  private static re = new RegExp(Parser.pattern)

  static parse(candidate: string): ValidSsn {
    const m = candidate.match(Parser.re)
    if (m == null) throw Error('Invalid ssn: pattern mismatch')

    const a = Groups.bday.valueOf()

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
      isTemporal: () => nnn.isTemporal()
    }
  }
}

