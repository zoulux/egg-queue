'use strict';

const registerTasks = require('./lib/register_tasks');
const createQueue = require('./lib/create_queue');

module.exports = app => {
  createQueue(app);
  registerTasks(app);
};
