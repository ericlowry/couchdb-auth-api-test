const assert = require('assert');
const httpError = require('../../../common/lib/http-error');
const { FORBIDDEN } = require('http-status-codes');

const isAuth = require('./is-auth');

const hasRole = (roleName) => [
  isAuth,
  async (req, res, next) => {
    assert(req.user && req.user.roles);
    if (!req.user.roles.includes(roleName)) {
      throw httpError(FORBIDDEN, undefined, `missing-role ${roleName}`);
    }
    next();
  },
];

module.exports = hasRole;
