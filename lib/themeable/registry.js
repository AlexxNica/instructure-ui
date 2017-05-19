import invariant from 'invariant'
import warn from './util/warn'
import mergeDeep from './util/mergeDeep'
import shortid from 'shortid'
import canUseDOM from './util/canUseDOM'

const DEFAULT_THEME_KEY = '@@themeableDefaultTheme'

const makeRegistry = function () {
  return {
    defaultThemeKey: null,
    components: {
      [DEFAULT_THEME_KEY]: {}
    },
    themes: {},
    registered: [] // the theme keys in the order they are registered
  }
}

let GLOBAL_THEME_REGISTRY = makeRegistry()

const validateRegistry = function (registry) {
  let valid = true
  const defaultRegistry = makeRegistry()

  Object.keys(defaultRegistry).forEach((key) => {
    if (!registry || registry[key] === undefined) {
      valid = false
    }
  })

  invariant(valid, 'Inavlid theme registry.')

  return registry
}

export const getRegistry = function () {
  if (!canUseDOM) {
    return GLOBAL_THEME_REGISTRY
  }

  if (!window.GLOBAL_THEME_REGISTRY) {
    window.GLOBAL_THEME_REGISTRY = GLOBAL_THEME_REGISTRY
  }

  return validateRegistry(window.GLOBAL_THEME_REGISTRY)
}

export const setRegistry = function (registry) {
  GLOBAL_THEME_REGISTRY = registry

  if (canUseDOM) {
    window.GLOBAL_THEME_REGISTRY = GLOBAL_THEME_REGISTRY
  }
}

export const clearRegistry = function () {
  setRegistry(makeRegistry())
}

export const getDefaultThemeKey = function () {
  const { defaultThemeKey, registered } = getRegistry()
  return defaultThemeKey || registered[0] || DEFAULT_THEME_KEY
}

export const setDefaultTheme = function (themeKey, overrides, immutable) {
  const registry = getRegistry()
  const theme = registry.themes[themeKey]

  invariant(theme, `Could not find theme: '${themeKey}' in the registry.`)

  registry.themes[themeKey] = {
    ...theme,
    immutable
  }

  registry.defaultThemeKey = themeKey
  registry.overrides = overrides
}

export function registerTheme (theme) {
  const registry = getRegistry()
  const key = theme.key || shortid.generate()

  registry.themes[key] = theme
  registry.registered.push(key)
}

/**
 * Wraps a theme and provides a method to set as default and toggle between a11y and base
 *
 * @param {String} themeKey
 * @param {Object} options Provide the base theme and an optional accessible version
 */
export function makeTheme ({ theme, a11y }) {
  return {
    ...theme,
    use: function ({ accessible, overrides } = {}) {
      if (accessible) {
        invariant(a11y, `No accessible theme provided for ${theme.key}.`)
        setDefaultTheme(a11y.key, null, true)
      } else {
        invariant(theme, `Invalid theme.`)
        setDefaultTheme(theme.key, overrides, false)
      }
    }
  }
}

const getRegisteredTheme = function (themeKey, defaultTheme) {
  const theme = getRegistry().themes[themeKey]

  if (!defaultTheme) {
    invariant(theme, `Could not find theme: '${themeKey}' in the registry.`)
  }

  return theme || defaultTheme
}

const overrideThemeVariables = function (themeKey, overrides) {
  const theme = getRegisteredTheme(themeKey, {})
  let variables = {}

  if (overrides && theme.immutable) {
    warn(
      `themeable: Theme, '%s', is immutable. Cannot apply overrides: %o`,
      themeKey,
      overrides
    )
    variables = theme.variables
  } else {
    variables = mergeDeep(theme.variables, overrides)
  }

  return variables
}

/**
 * Merge theme variables for 'themeKey' with the defaults (and overrides)
 *
 * @param {String} themeKey
 * @param {Object} variable Theme overrides
 * @return {Object} A merged variables object
 */
const mergeWithDefaultThemeVariables = function (themeKey, overrides) {
  if (themeKey) {
    return mergeDeep(
      overrideThemeVariables(getDefaultThemeKey(), getRegistry().overrides),
      overrideThemeVariables(themeKey, overrides)
    )
  } else { // fall back to defaults, but still apply overrides
    return overrideThemeVariables(
      getDefaultThemeKey(),
      mergeDeep(getRegistry().overrides, overrides)
    )
  }
}

/**
 * Wraps a component theme function to merge its return values with the return
 * values of the default function
 *
 * @param {Function} componentThemeFunction
 * @param {String} themeKey
 * @return {Object} A wrapped theme object
 */
const makeComponentTheme = function (componentThemeFunction, themeKey) {
  return function (variables) {
    let theme = {}

    if (typeof componentThemeFunction === 'function') {
      theme = componentThemeFunction(variables)
    }

    // so that the components for the themeKey can
    // just specify overrides we merge them here
    if (typeof componentThemeFunction[themeKey] === 'function') {
      theme = {...theme, ...componentThemeFunction[themeKey](variables)}
    }

    return theme
  }
}

/**
 * Register a component theme function
 *
 * @param {String} key The theme key for the component (e.g., [Link.theme])
 * @param {Function} componentThemeFunction The function to use for preparing this component's theme
 */
export function registerComponentTheme (componentKey, componentThemeFunction) {
  const registry = getRegistry()

  if (typeof componentThemeFunction !== 'function') {
    return
  }

  registry.components[DEFAULT_THEME_KEY][componentKey] = componentThemeFunction

  Object.keys(componentThemeFunction).forEach((themeKey) => {
    if (!registry.components.hasOwnProperty(themeKey)) {
      registry.components[themeKey] = {}
    }

    registry.components[themeKey][componentKey] = makeComponentTheme(componentThemeFunction, themeKey)
  })
}

const getRegisteredComponents = function (themeKey) {
  const registry = getRegistry()
  const t = themeKey || getDefaultThemeKey()

  // fall back to the default component theme functions
  return {
    ...registry.components[DEFAULT_THEME_KEY],
    ...registry.components[t]
  }
}

/**
 * Generate themes for all @themeable components, to be used by `<ApplyTheme />`.
 *
 * @param {String} themeKey The theme to use (for global theme variables across components)
 * @param {Object} overrides theme variable overrides (usually for user defined values)
 * @return {Object} A theme config to use with `<ApplyTheme />`
 */
export function generateTheme (themeKey, overrides) {
  const registry = getRegistry()

  invariant((registry.registered.length > 0), 'No themes have been registered. ' +
    'Import a theme from instructure-ui/lib/themes or register a custom theme with registerTheme ' +
    '(see instructure-ui/lib/themeable/registry.js).'
  )

  const components = getRegisteredComponents(themeKey)
  const theme = {}
  const variables = mergeWithDefaultThemeVariables(themeKey, overrides)

  Object.getOwnPropertySymbols(components).forEach((componentKey) => {
    theme[componentKey] = components[componentKey](variables)
  })

  return theme
}

/**
 * Return theme variables for themeKey.
 *
 * @param {String} themeKey The theme to use to generate the variables
 * @return {Object} A theme config to use with `<ApplyTheme />`
 */
export function getTheme (themeKey) {
  return getRegisteredTheme(themeKey, {}).variables || {}
}

/**
 * Generate theme variables for a @themeable component.
 * If no themeKey is provided, the default theme will be generated.
 *
 * @param {Symbol} key The theme key for the component (e.g., [Link.theme])
 * @param {String} themeKey The theme to use to generate the variables (falls back to the default theme)
 * @param {Object} overrides overrides for component level theme variables (usually user defined)
 * @return {Object} A theme config for the component
 */
export function generateComponentTheme (componentKey, themeKey, overrides) {
  const t = themeKey || getDefaultThemeKey()

  // fall back to the default component theme functions
  const components = getRegisteredComponents(themeKey)
  const variables = mergeWithDefaultThemeVariables(themeKey)

  const componentThemeFunction = components[componentKey]

  let componentTheme = {}

  if (typeof componentThemeFunction === 'function') {
    try {
      componentTheme = componentThemeFunction(variables)
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(e) // eslint-disable-line no-console
      }
    }
  }

  const theme = getRegisteredTheme(t, {})

  if (theme.immutable && overrides) {
    warn(
      `themeable: Theme '%s' is immutable. Cannot apply overrides for '%s': %o`,
      t,
      componentKey.toString(),
      overrides
    )
    return componentTheme
  } else {
    return { ...componentTheme, ...(overrides || {}) }
  }
}
