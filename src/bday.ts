import * as moment from 'moment'

import * as random from './random'
import * as century from './century'

export default class Bday {
  constructor(readonly value: moment.Moment) {}

  toString() { return this.value.format('DDMMYY') }

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

  private static toCentury(date: moment.Moment) {
    return Math.floor((date.year() / 100)) * 100
  }
}