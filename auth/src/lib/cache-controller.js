//
// cache-controller.js: construct a cache controller interface
//
const assert = require('assert');
const redis = require('redis');

module.exports = (cacheURI, defaultTTL) => {
  assert(cacheURI);
  assert(typeof defaultTTL === 'number');
  const cache = redis.createClient(cacheURI);
  cache.on('error', console.error);
  return {
    create: (key, value, ttl = defaultTTL) =>
      new Promise((resolve, reject) =>
        cache.SETEX(key, ttl, JSON.stringify(value), (err, reply) => {
          if (err) return reject(err);
          resolve(reply);
        })
      ),

    retrieve: (key) =>
      new Promise((resolve, reject) =>
        cache.GET(key, (err, reply) => {
          if (err) return reject(err);
          try {
            resolve(JSON.parse(reply));
          } catch (error) {
            reject(error);
          }
        })
      ),

    update: (key, value, ttl = defaultTTL) =>
      new Promise((resolve, reject) =>
        cache.SETEX(key, ttl, JSON.stringify(value), (err, reply) => {
          if (err) return reject(err);
          resolve(reply);
        })
      ),

    delete: (key) =>
      new Promise((resolve, reject) =>
        cache.DEL(key, (err, reply) => {
          if (err) return reject(err);
          resolve(true);
        })
      ),

    setTTL: (key, ttl = defaultTTL) =>
      new Promise((resolve, reject) =>
        cache.EXPIRE(key, ttl, (err) => {
          if (err) return reject(err);
          resolve(true);
        })
      ),
  };
};
