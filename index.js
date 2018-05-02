'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/js-spec.production.js');
} else {
  module.exports = require('./dist/js-spec.development.js');
}