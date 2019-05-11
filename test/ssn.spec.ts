import { LocalDate } from 'js-joda'

import * as ssn from '../src'

describe('ssn', () => {
  const bday1900 = LocalDate.of(1980, 2, 22)
  const bday2000 = LocalDate.of(2000, 11, 12)

  it('female', () => {
    expect(ssn.Parser.parse('210721-1703').isFemale()).toBeTruthy()

    const actual = ssn.Parser.parse(ssn.female(bday1900))
    expect(actual.isFemale()).toBeTruthy()
    expect(actual.isTemporal()).toBeFalsy()
  })

  it('male', () => {
    expect(ssn.Parser.parse('260785-309A').isFemale()).toBeFalsy()

    const actual = ssn.Parser.parse(ssn.male(bday2000))
    expect(actual.isFemale()).toBeFalsy()
    expect(actual.isTemporal()).toBeFalsy()
  })

  it('female temporal', () => {
    expect(ssn.Parser.parse('090707-998E').isFemale()).toBeTruthy()

    const actual = ssn.Parser.parse(ssn.femaleTemporal(bday2000))
    expect(actual.isFemale()).toBeTruthy()
    expect(actual.isTemporal()).toBeTruthy()
  })

  it('male temporal', () => {
    expect(ssn.Parser.parse('050162-981N').isFemale()).toBeFalsy()

    const actual = ssn.Parser.parse(ssn.maleTemporal(bday1900))
    expect(actual.isFemale()).toBeFalsy()
    expect(actual.isTemporal()).toBeTruthy()
  })

  it('bday', () => {
    const nonDate = 'xxxxxx-450F'
    expect(() => ssn.Parser.parse(nonDate)).toThrowError(
      'Invalid bday: pattern mismatch',
    )
  })

  it('century id', () => {
    const valid = ssn.Parser.parse('220305A244S')

    const lowercase = `${valid.bday}a${valid.nnn}${valid.cc}`
    expect(() => ssn.Parser.parse(lowercase)).toThrowError(
      'Unsupported century id a',
    )

    const notSupported = '090521+9220'
    expect(() => ssn.Parser.parse(notSupported)).toThrowError(
      'Unsupported century id +',
    )
  })

  it('nnn', () => {
    expect(() => ssn.Parser.parse('020146-000F')).toThrowError(
      'Invalid nnn: 000',
    )
  })

  it('control char', () => {
    const valid = ssn.Parser.parse('020146-450F')

    const lowercase = `${valid.bday}-${valid.nnn}f`
    expect(() => ssn.Parser.parse(lowercase)).toThrowError(
      'Invalid ssn: control char mismatch',
    )

    const realMismatch = `${valid.bday}-${valid.nnn}A`
    expect(() => ssn.Parser.parse(realMismatch)).toThrowError(
      'Invalid ssn: control char mismatch',
    )
  })

  it('pattern: too short', () => {
    const tooShort = ssn.male().substring(1)
    expect(() => ssn.Parser.parse(tooShort)).toThrowError(
      'Invalid ssn: pattern mismatch',
    )
  })

  it('pattern: too long', () => {
    const tooLong = ssn.male() + 'X'
    expect(() => ssn.Parser.parse(tooLong)).toThrowError(
      'Invalid ssn: pattern mismatch',
    )
  })
})
