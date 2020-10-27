const assert = require('assert');
const redis = require('redis');
const cacheController = require('../../../common/lib/cache-controller');
const SESSION_CACHE = process.env.SESSION_CACHE.trim();
assert(SESSION_CACHE);
const SESSION_DURATION = parseInt(process.env.SESSION_DURATION || '28800'); // 8 Hours

const client = redis.createClient(SESSION_CACHE);
client.on('error', console.error);

module.exports = cacheController(client, SESSION_DURATION);
