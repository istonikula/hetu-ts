import * as moment from 'moment'

import * as ssn from './index'

describe('ssn', () => {
  const bday1900 = moment({ year: 1980, month: 2, day: 22 })
  const bday2000 = moment({ year: 2000, month: 11, day: 12 })

  it('female', () => {
    const actual = ssn.Parser.parse(ssn.female(bday1900))
    expect(actual.isFemale()).toBeTruthy()
    expect(actual.isTemporal()).toBeFalsy()
  })

  it('male', () => {
    const actual = ssn.Parser.parse(ssn.male(bday2000))
    expect(actual.isFemale()).toBeFalsy()
    expect(actual.isTemporal()).toBeFalsy()
  })

  it('female temporal', () => {
    const actual = ssn.Parser.parse(ssn.femaleTemporal(bday2000))
    expect(actual.isFemale()).toBeTruthy()
    expect(actual.isTemporal()).toBeTruthy()
  })

  it('male temporal', () => {
    const actual = ssn.Parser.parse(ssn.maleTemporal(bday1900))
    expect(actual.isFemale()).toBeFalsy()
    expect(actual.isTemporal()).toBeTruthy()
  })
})
