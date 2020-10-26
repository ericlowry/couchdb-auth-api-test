const assert = require('assert');

const cacheController = require('./cache-controller');

const SESSION_CACHE = process.env.SESSION_CACHE.trim();

assert(SESSION_CACHE);

const SESSION_DURATION = parseInt(process.env.SESSION_DURATION || '28800'); // 8 Hours

module.exports = cacheController(SESSION_CACHE, SESSION_DURATION);
