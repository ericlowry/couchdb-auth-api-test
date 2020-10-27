const debug = require('debug')('auth:users');
const assert = require('assert');
const nano = require('nano');

const httpError = require('../../../common/lib/http-error');
const docController = require('../../../common/lib/db-doc-controller');

const { USERDB } = process.env;
assert(USERDB);
const userDB = nano(USERDB);

const _users = docController(userDB, 'user', 'org.couchdb.user');

module.exports = {
  ..._users,
};
