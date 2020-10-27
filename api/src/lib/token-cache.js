const assert = require('assert');
const redis = require('redis');
const cacheController = require('../../../common/lib/cache-controller');
const TOKEN_CACHE = process.env.TOKEN_CACHE.trim();
assert(TOKEN_CACHE);
const TOKEN_DURATION = parseInt(process.env.TOKEN_DURATION || '900'); // 15 mins

const client = redis.createClient(TOKEN_CACHE);
client.on('error', console.error);

module.exports = cacheController(client, TOKEN_DURATION);
