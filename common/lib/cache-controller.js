//
// cache-controller.js: construct a cache controller interface
//
const assert = require('assert');

module.exports = (client, defaultTTL) => {
  // make sure we got a redis client
  assert(client && client.DBSIZE);
  assert(typeof defaultTTL === 'number');
  return {
    //
    // create(key,value,[ttl]): cache a json object
    //
    create: (key, value, ttl = defaultTTL) =>
      new Promise((resolve, reject) =>
        client.SETEX(key, ttl, JSON.stringify(value), (err, reply) => {
          if (err) return reject(err);
          resolve(reply);
        })
      ),

    //
    // retrieve(key): retrieve a json object from the cache
    //
    retrieve: (key) =>
      new Promise((resolve, reject) =>
        client.GET(key, (err, reply) => {
          if (err) return reject(err);
          try {
            resolve(JSON.parse(reply));
          } catch (error) {
            reject(error);
          }
        })
      ),

    //
    // update(key,value[,ttl]): update a cached value
    //
    update: (key, value, ttl = defaultTTL) =>
      new Promise((resolve, reject) =>
        client.SETEX(key, ttl, JSON.stringify(value), (err, reply) => {
          if (err) return reject(err);
          resolve(reply);
        })
      ),

    //
    // delete(key): delete a value from the cache
    //
    delete: (key) =>
      new Promise((resolve, reject) =>
        client.DEL(key, (err, reply) => {
          if (err) return reject(err);
          resolve(true);
        })
      ),

    //
    // setTTL(key[,ttl]): set the TTL for a key
    //
    setTTL: (key, ttl = defaultTTL) =>
      new Promise((resolve, reject) =>
        client.EXPIRE(key, ttl, (err) => {
          if (err) return reject(err);
          resolve(true);
        })
      ),
  };
};
