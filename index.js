'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/cjs/js-spec.production.js');
} else {
  module.exports = require('./dist/cjs/js-spec.development.js');
}