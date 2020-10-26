const assert = require('assert');

const cacheController = require('./cache-controller');

const TOKEN_CACHE = process.env.TOKEN_CACHE.trim();

assert(TOKEN_CACHE);

const TOKEN_DURATION = parseInt(process.env.TOKEN_DURATION || '900'); // 15 mins

module.exports = cacheController(TOKEN_CACHE, TOKEN_DURATION);
