import { DateTimeFormatter, Instant, LocalDate, ZoneId } from 'js-joda'

import * as random from './random'
import { Century } from './century'

const df = DateTimeFormatter.ofPattern('ddMMyy')

enum Groups {
  day = 1,
  month = 2,
  year = 3,
}

export class Bday {
  constructor(readonly value: LocalDate) {}

  toString = () => this.value.format(df)

  century = () => Math.trunc((this.value.year() / 100)) * 100

  static from = (date: LocalDate) => new Bday(date)

  // NOTE: min and max are only approximations here as UTC is used
  static random = (minAge: number = 16, maxAge: number = 117) => {
    const start = LocalDate.now().minusYears(maxAge).atStartOfDay(ZoneId.UTC).toInstant().toEpochMilli()
    const end = LocalDate.now().minusYears(minAge).atStartOfDay(ZoneId.UTC).toInstant().toEpochMilli()
    return LocalDate.ofInstant(Instant.ofEpochMilli(random.fromRange(start, end)))
  }

  static parse(s: string, century: Century) {
    const m = s.match(Bday.re)
    if (m == null) {
      throw new Error('Invalid bday: pattern mismatch')
    }
    const day = parseInt(m[Groups.day], 10)
    const month = parseInt(m[Groups.month], 10)
    const year = parseInt(m[Groups.year], 10) + century.value

    return new Bday(LocalDate.of(year, month, day))
  }

  private static pattern =
    '^' + // start
    '(\\d{2})' + // dd
    '(\\d{2})' + // MM
    '(\\d{2})' + // yy
    '$' // end
  private static re = new RegExp(Bday.pattern)
}