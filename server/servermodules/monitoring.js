var config = require('../config.js');
var logger = require('../lib/logger.js');
var nodetime = require('nodetime');

// Setup for NodeTime Monitoring
module.exports = function () {
  if (config.monitoring.enabled) {  // no monitoring for testing required
    var monitoring = require('./../monitoring/monitor');
    nodetime.profile(config.monitoring.profile);
    logger.info("Monitoring enabled");
    setInterval(monitoring.monitor, config.monitoring.updateInterval);
  } else {
    logger.info("Monitoring disabled");
  }
};