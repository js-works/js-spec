'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('../dist/js-spec.validators.cjs.production.js')
} else {
  module.exports = require('../dist/js-spec.validators.cjs.development.js')
}