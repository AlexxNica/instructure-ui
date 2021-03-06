const transformCustomProps = require('@instructure/postcss-themeable-styles')
const transformCssRequire = require('@instructure/babel-plugin-themeable-styles/transform')
const postcss = require('postcss')

module.exports = function (source, map) {
  this.cacheable && this.cacheable()

  const loader = this
  const callback = loader.async()
  const file = loader.resourcePath

  source = this.exec(source, loader.resource) // eslint-disable-line no-param-reassign
  map = (typeof map === 'string') ? JSON.parse(map) : map  // eslint-disable-line no-param-reassign

  const opts = {
    from: file,
    to: file,
    map: {
      inline: false, // inline sourcemaps will break the js templates
      annotation: false,
      prev: (map && map.mappings) ? map : undefined
    }
  }

  Promise.resolve().then(() => {
    return postcss([transformCustomProps])
      .process(source.toString(), opts)
      .then((result) => {
        result.warnings().forEach((msg) => {
          loader.emitWarning(msg.toString())
        })
        callback(
          null,
          `module.exports = ${transformCssRequire(source.locals, result.css)}`,
          result.map ? result.map.toJSON() : null
        )
      })
  }).catch((error) => {
    callback(error)
  })
}
