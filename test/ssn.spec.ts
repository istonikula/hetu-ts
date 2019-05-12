import { LocalDate } from 'js-joda'

import * as ssn from '../src'

describe('ssn', () => {
  const bday1900 = LocalDate.of(1980, 2, 22)
  const bday2000 = LocalDate.of(2000, 11, 12)

  it('female', () => {
    verifyFemale(ssn.parse('210721-1703'))
    verifyFemale(ssn.parse(`${ssn.female(bday1900)}`))
    verifyFemale(ssn.parse(`${ssn.female()}`))
  })

  it('male', () => {
    verifyMale(ssn.parse('260785-309A'))
    verifyMale(ssn.parse(`${ssn.male(bday2000)}`))
    verifyMale(ssn.parse(`${ssn.male()}`))
  })

  it('female temporal', () => {
    verifyFemaleTemporal(ssn.parse('090707-998E'))
    verifyFemaleTemporal(ssn.parse(`${ssn.femaleTemporal(bday2000)}`))
    verifyFemaleTemporal(ssn.parse(`${ssn.femaleTemporal()}`))
  })

  it('male temporal', () => {
    verifyMaleTemporal(ssn.parse('050162-981N'))
    verifyMaleTemporal(ssn.parse(`${ssn.maleTemporal(bday1900)}`))
    verifyMaleTemporal(ssn.parse(`${ssn.maleTemporal()}`))
  })

  it('bday', () => {
    const nonDate = 'xxxxxx-450F'
    expect(() => ssn.parse(nonDate)).toThrowError('Invalid bday: pattern mismatch')
  })

  it('century id', () => {
    const valid = ssn.parse('220305A244S')

    const lowercase = `${valid.bday}a${valid.nnn}${valid.control}`
    expect(() => ssn.parse(lowercase)).toThrowError('Unsupported century id a')

    const notSupported = '090521+9220'
    expect(() => ssn.parse(notSupported)).toThrowError('Unsupported century id +')
  })

  it('nnn', () => {
    expect(() => ssn.parse('020146-000F')).toThrowError('Invalid nnn: 000')
  })

  it('control char', () => {
    const valid = ssn.parse('020146-450F')

    const lowercase = `${valid.bday}-${valid.nnn}f`
    expect(() => ssn.parse(lowercase)).toThrowError('Invalid ssn: control char mismatch')

    const realMismatch = `${valid.bday}-${valid.nnn}A`
    expect(() => ssn.parse(realMismatch)).toThrowError('Invalid ssn: control char mismatch')
  })

  it('pattern: too short', () => {
    const tooShort = `${ssn.male()}`.substring(1)
    expect(() => ssn.parse(tooShort)).toThrowError('Invalid ssn: pattern mismatch')
  })

  it('pattern: too long', () => {
    const tooLong = ssn.male() + 'X'
    expect(() => ssn.parse(tooLong)).toThrowError('Invalid ssn: pattern mismatch')
  })
})

const verifySsn = (isFemale: boolean, isTemporal: boolean) => (actual: ssn.ValidSsn) => {
  expect(actual.isFemale()).toEqual(isFemale)
  expect(actual.isMale()).toEqual(!isFemale)
  expect(actual.isTemporal()).toEqual(isTemporal)
}

const verifyFemale = verifySsn(true, false)
const verifyFemaleTemporal = verifySsn(true, true)
const verifyMale = verifySsn(false, false)
const verifyMaleTemporal = verifySsn(false, true)
