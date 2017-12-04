'use strict';

const createQueue = require('./lib/create_queue');
const registerTasks = require('./lib/register_tasks');

module.exports = app => {
  createQueue(app);
  registerTasks(app);
};
