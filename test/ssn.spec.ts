import { LocalDate } from 'js-joda'

import * as ssn from '../src'
import * as Result from '../src/result'

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
    expectError(ssn.parse(nonDate), 'Invalid bday: pattern mismatch')
  })

  it('century id', () => {
    const valid = ensureValid(ssn.parse('220305A244S'))
    const lowercase = `${valid.bday}a${valid.nnn}${valid.control}`
    expectError(ssn.parse(lowercase), 'Unsupported century id a')

    const notSupported = '090521+9220'
    expectError(ssn.parse(notSupported), 'Unsupported century id +')
  })

  it('nnn', () => {
    expectError(ssn.parse('020146-000F'), 'Invalid nnn: 000')
  })

  it('control char', () => {
    const valid = ensureValid(ssn.parse('020146-450F'))

    const lowercase = `${valid.bday}-${valid.nnn}f`
    expectError(ssn.parse(lowercase), 'Invalid ssn: control char mismatch')

    const realMismatch = `${valid.bday}-${valid.nnn}A`
    expectError(ssn.parse(realMismatch), 'Invalid ssn: control char mismatch')
  })

  it('pattern: too short', () => {
    const tooShort = `${ssn.male()}`.substring(1)
    expectError(ssn.parse(tooShort), 'Invalid ssn: pattern mismatch')
  })

  it('pattern: too long', () => {
    const tooLong = ssn.male() + 'X'
    expectError(ssn.parse(tooLong), 'Invalid ssn: pattern mismatch')
  })
})

const ensureValid = (result: Result.Type<ssn.ValidSsn>): ssn.ValidSsn =>
  Result.isSuccess(result) ? result : fail(`success expected, got ${result}`)

const expectError = (result: Result.Type<ssn.ValidSsn>, expected: string): void => {
  if (Result.isError(result)) {
    expect(result.message).toEqual(expected)
    return
  }
  fail(`error expected`)
}

const verifySsn = (isFemale: boolean, isTemporal: boolean) => (actual: Result.Type<ssn.ValidSsn>) => {
  const valid = ensureValid(actual)
  expect(valid.isFemale()).toEqual(isFemale)
  expect(valid.isMale()).toEqual(!isFemale)
  expect(valid.isTemporal()).toEqual(isTemporal)
}

const verifyFemale = verifySsn(true, false)
const verifyFemaleTemporal = verifySsn(true, true)
const verifyMale = verifySsn(false, false)
const verifyMaleTemporal = verifySsn(false, true)
