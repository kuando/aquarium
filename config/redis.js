'use strict';
/**
 * Module dependencies.
 */

const Redis = require('ioredis');
const config = require('./config').redis;

const redis = new Redis({

    port: config.port,

    host: config.host,

    keyPrefix: config.prefix,
    
    password: config.auth_pass,

    retryStrategy(times) {
        if (times > 200) {
            console.warn("redis 连接失败, 尝试连接次数为 %d", times);
        }
        return Math.min(times * 2, 2000);
    }

});

redis.on('connect', function () {
    console.log('redis connect success');
});

redis.on('error', function (err) {
    console.error('redis connect failed : ', err);
});


module.exports = redis;
