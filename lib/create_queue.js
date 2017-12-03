'use strict';

const kue = require('kue');

module.exports = app => {

  const config = app.config.queue;
  app.queue = kue.createQueue(config);

};
