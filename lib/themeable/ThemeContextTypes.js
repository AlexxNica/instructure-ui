import PropTypes from 'prop-types'

const CONTEXT_KEY = '@@themeable'

export const ThemeContextTypes = {
  [CONTEXT_KEY]: PropTypes.object
}

export function makeThemeContext (theme, immutable) {
  return {[CONTEXT_KEY]: {
    theme,
    immutable
  }}
}

export function getThemeContext (context) {
  return context ? context[CONTEXT_KEY] : undefined
}
