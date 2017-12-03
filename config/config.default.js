'use strict';

/**
 * egg-queue default config
 * @member Config#queue
 * @property {String} SOME_KEY - some description
 */
exports.queue = {
  register: true,
  listen: 7002,
  prefix: 'kuequeue',
  redis: {
    port: 6379, // Redis port
    host: 'myredis', // Redis host
    password: null,
    db: 2,
  },
};
