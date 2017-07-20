// clear the console before rebundling.
/* eslint-disable no-console */
if (typeof console.clear === 'function') {
  console.clear()
}
/* eslint-enable no-console */

/*
  eslint-disable
    import/no-dynamic-require,
    import/no-extraneous-dependencies,
    import/no-webpack-loader-syntax,
    import/no-unresolved
*/
require('babel-polyfill-loader!')
require('!!style-loader!css-loader!./tests.css')
/*
  eslint-enable
    import/no-dynamic-require,
    import/no-extraneous-dependencies,
    import/no-webpack-loader-syntax,
    import/no-unresolved
*/

require('../lib/themes')

// utils
const utilsContext = require.context('./util', true)
utilsContext.keys().forEach(utilsContext)

// tests
const testsContext = require.context('../lib', true, /\.test\.js$/)
testsContext.keys().forEach(testsContext)
