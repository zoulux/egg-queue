# egg-queue

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-queue.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-queue
[travis-image]: https://img.shields.io/travis/eggjs/egg-queue.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-queue
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-queue.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-queue?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-queue.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-queue
[snyk-image]: https://snyk.io/test/npm/egg-queue/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-queue
[download-image]: https://img.shields.io/npm/dm/egg-queue.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-queue

<!--
Description here.
-->

## Install

```bash
$ npm i egg-queue --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.queue = {
  enable: true,
  package: 'egg-queue',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.queue = {
     register: true, //是否注册事件（queue和主工程分开，可以两个docker运行）
     listen: 7002,  //kue默认提供了一个[UI](https://github.com/Automattic/kue/blob/master/Readme.md#user-interface)
     prefix: 'kuequeue',
     redis: {
        port: 6379, // Redis port
        host: 'myredis', // Redis host
        password: null,
        db: 2,
     },
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->
### 这里注册task可以使用两种形式
1. 导出一个函数
```js
// app/queue/send_sms.js

'use strict';

module.exports = {

  /**
     * 执行queue中的任务
     * @param {Object} ctx egg中的ctx，方便访问egg中的资源
     * @param {Object} job kue中的job
     * @param {Object} kueCtx kue中的ctx，可以控制任务的暂停，重启
     * @param {function}  done 任务完成成功done()，失败done(err)
     * @return {void}
     */
  async task(ctx, job, kueCtx, done) {
    console.log(job);
    done();
  },

  /**
     *添加到queue中的标志
     *可选，默认action为js文件名 send_sms.js => sendSms
     * @return {string} action
     */
  get action() {
    return 'send_sms';
  },

  /**
     *任务的并发量
     *可选，默认为1
     * @return {number} concurrency
     */
  get concurrency() {
    return 2;
  },
};

```

2. 导出一个class
```js
// app/queue/send_sms3.js
'use strict';

const Subscription = require('egg').Subscription;

class SmsSendSubscription extends Subscription {

  /**
     * 执行queue中的任务，this 为egg的ctx
     * @param {Object} job kue中的job
     * @param {Object} kueCtx kue中的ctx，可以控制任务的暂停，重启
     * @param {function}  done 任务完成成功done()，失败done(err)
     * @return {void}
     */
  async subscribe(job, kueCtx, done) {
    setTimeout(() => {
      done();
    }, 5000);
  }


  /**
     *添加到queue中的标志
     *可选，默认action为js文件名 send_sms.js => sendSms
     * @return {string} action
     */
  static get action() {
    return 'send_sms3';
  }

  /**
     *任务的并发量
     *可选，默认为1
     * @return {number} concurrency
     */
  get concurrency() {
    return 2;
  }

}

module.exports = SmsSendSubscription;

```
### 发布task
```js
    const { queue } = ctx.app;

    const res = await queue.create('send_sms3', {
      phone: '139********',
    }).save();
```
`queue`即为`kue`中的`queue`

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
