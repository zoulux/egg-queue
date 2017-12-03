'use strict';

const loadSchedule = require('./load_queue');
const kue = require('kue');
const qs = require('querystring');

module.exports = app => {

  const { listen, register } = app.config.queue;

  if (register) {
    const tasks = loadSchedule(app);
    const { queue } = app;

    kue.app.listen(listen);
    Object.values(tasks).forEach(_task => {
      const { task, key, action, concurrency } = _task;

      const eggCtx = app.createAnonymousContext({
        method: 'QUEUE',
        url: `/__queue?${qs.stringify({
          path: key,
          action,
          concurrency,
        })}`,
      });
      queue.process(action, concurrency || 1, (job, kueCtx, done) => task(eggCtx, job, kueCtx, done));
    });
  }

};

