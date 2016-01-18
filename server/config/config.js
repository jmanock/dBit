'use strict';
var _ = require('lodash');
module.exports = _.extend(
  require('./enviroment/all.js'),
  require('./enviroment/'+ process.enviroment.NODE_ENV + '.js') || {}
);
