import { DateTimeFormatter, Instant, LocalDate, ZoneId } from 'js-joda'

import * as random from './random'
import * as century from './century'

const df = DateTimeFormatter.ofPattern('ddMMyy')

enum Groups {
  day = 1,
  month = 2,
  year = 3,
}

export class Bday {
  constructor(readonly value: LocalDate) {}

  toString = () => this.value.format(df)

  toCenturyId = () => century.parse(Bday.toCentury(this.value))

  static from = (date: LocalDate) => new Bday(date)

  // NOTE: min and max are only approximations here as UTC is used
  static random = (minAge: number = 16, maxAge: number = 117) => {
    const start = LocalDate.now().minusYears(maxAge).atStartOfDay(ZoneId.UTC).toInstant().toEpochMilli()
    const end = LocalDate.now().minusYears(minAge).atStartOfDay(ZoneId.UTC).toInstant().toEpochMilli()
    return LocalDate.ofInstant(Instant.ofEpochMilli(random.fromRange(start, end)))
  }

  public static parse(s: string, centuryId: century.CenturyId) {
    const m = s.match(Bday.re)
    if (m == null) {
      throw Error('Invalid bday: pattern mismatch')
    }
    const day = parseInt(m[Groups.day], 10)
    const month = parseInt(m[Groups.month], 10)
    const year = parseInt(m[Groups.year], 10) + centuryId.century()

    return new Bday(LocalDate.of(year, month, day))
  }

  private static pattern =
    '^' + // start
    '(\\d{2})' + // dd
    '(\\d{2})' + // MM
    '(\\d{2})' + // yy
    '$' // end
  private static re = new RegExp(Bday.pattern)

  private static toCentury = (date: LocalDate) => Math.floor((date.year() / 100)) * 100
}