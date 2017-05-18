import { registerTheme, makeTheme } from '../../../themeable/registry'
import KEYS from '../../keys'

import colors from './colors'
import base from '../base'

const theme = {
  key: KEYS.MODERN_A11Y,
  immutable: true,
  variables: {
    ...base.variables,
    colors
  }
}

registerTheme(theme)

export default makeTheme({ theme })
