const debug = require('debug')('auth:users');
const assert = require('assert');
const nano = require('nano');

const httpError = require('./http-error');
const docController = require('./db-doc-controller');

const { USERDB } = process.env;
assert(USERDB);
const userDB = nano(USERDB);

const _users = docController(userDB, 'user', 'org.couchdb.user');

module.exports = {
  authenticate: async (name, password) => {
    const auth = await userDB.auth(name, password);
    if (auth.roles[0] === '_admin') {
      throw httpError(403, undefined, 'Forbidden user... (DB Admin)');
    }
    return _users.retrieve(name);
  },

  ..._users,
};
