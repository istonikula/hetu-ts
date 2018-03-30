
import { Moment } from 'moment'

import Bday from './bday'
import Nnn, { Gender} from './nnn'
import * as cc from './cc'

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
  bday: Bday,
  nnn: Nnn,
  cc: string
}

