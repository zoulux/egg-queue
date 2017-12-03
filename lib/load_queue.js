'use strict';

const path = require('path');
const assert = require('assert');
const is = require('is-type-of');

module.exports = app => {
  const dirs = app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/queue'));
  const Loader = getQueueLoader(app);
  const tasks = app.queueTask = {};
  new Loader({
    directory: dirs,
    target: tasks,
    inject: app,
  }).load();
  return tasks;
};

function getQueueLoader(app) {
  return class QueueLoader extends app.loader.FileLoader {
    load() {
      const target = this.options.target;
      const items = this.parse();

      for (const item of items) {
        const { fullpath, properties: [ _action ], exports: _task } = item;
        const { action = _action, concurrency = 1 } = _task;


        assert(action, `schedule(${fullpath}): must have action and task properties`);
        assert(is.class(_task) || is.function(_task.task), `schedule(${fullpath}: schedule.task should be function or schedule should be class`);

        let task;
        if (is.class(_task)) {
          task = (ctx, job, kueCtx, done) => {
            const s = new _task(ctx);

            s.subscribe = app.toAsyncFunction(s.subscribe);
            return s.subscribe(job, kueCtx, done);
          };
        } else {
          task = app.toAsyncFunction(_task.task);
        }

        target[fullpath] = {
          key: fullpath,
          task,
          action,
          concurrency,
        };
      }
    }
  };
}
