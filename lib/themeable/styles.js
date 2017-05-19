import { StyleSheet } from 'glamor/lib/sheet'
import { toRules } from './util/transformCss'
import canUseDOM from './util/canUseDOM'

const STYLES = {}
let THEMEABLE_STYLESHEET

export function mount (id, cssText) {
  if (!STYLES[id]) {
    STYLES[id] = {
      cssText,
      rules: insert(toRules(cssText))
    }
  }
}

export function flush () {
  const sheet = getSheet()
  sheet.flush()
}

function insert (rules) {
  const sheet = getSheet()

  const inserted = []
  rules.forEach((rule) => {
    if (rule) {
      inserted.push(sheet.insert(rule))
    }
  })
}

function getSheet () {
  let sheet = canUseDOM ? window.THEMEABLE_STYLESHEET : THEMEABLE_STYLESHEET

  if (!sheet) {
    sheet = THEMEABLE_STYLESHEET = createSheet()

    if (canUseDOM) {
      window.THEMEABLE_STYLESHEET = sheet
    }
  }

  return sheet
}

function createSheet () {
  const sheet = new StyleSheet({ speedy: !process.env.DEBUG, maxLength: 40 })
  sheet.inject()
  return sheet
}
