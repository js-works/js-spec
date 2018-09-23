'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/noop/js-spec.noop.cjs.production.js')
} else {
  module.exports = require('./dist/js-spec.cjs.development.js')
}
