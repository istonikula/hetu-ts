import Bday from './bday'
import Nnn from './nnn'

const controlCharLookup = '0123456789ABCDEFHJKLMNPRSTUVWXY'

export function from(bday: Bday, nnn: Nnn) {
  const idx = parseInt(`${bday}${nnn}`, 10) % controlCharLookup.length
  return controlCharLookup.charAt(idx)
}
