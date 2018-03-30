import * as moment from 'moment'

import * as random from './random'
import * as century from './century'

export default class Bday {
  constructor(readonly value: moment.Moment) {}

  toString() { return this.value.format(Bday.format) }

  toCenturyId() {
    return century.parse(Bday.toCentury(this.value))
  }

  static from(date: moment.Moment) {
    return new Bday(date)
  }

  static random(minAge: number = 16, maxAge: number = 117) {
    const start = moment().subtract(maxAge, 'years').valueOf()
    const end = moment().subtract(minAge, 'years').valueOf()
    return moment(random.fromRange(start, end))
  }

  static parse(s: string, centuryId: century.CenturyId) {
    const parsed = moment(s, Bday.format)
    return new Bday(parsed.year(Bday.yearOffset(parsed) + centuryId.century()))
  }

  private static format = 'DDMMYY'

  private static toCentury(date: moment.Moment) {
    return Math.floor((date.year() / 100)) * 100
  }

  private static yearOffset(date: moment.Moment) {
    return date.year() % 100
  }
}