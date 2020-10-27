//
// is-auth.js - Middleware for loading a request's user into req.user
//
const debug = require('debug')('api:is-auth');
const httpError = require('../../../common/lib/http-error');
const tokenCache = require('./token-cache');
const { UNAUTHORIZED } = require('http-status-codes');

const isAuth = async (req, res, next) => {
  // is the request already authenticated?...
  if (req.user) {
    // ...yes, so move on.
    return next();
  } else {
    // ...nope, let's do this.

    // get the authorization "Bearer Token" header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw httpError(UNAUTHORIZED, undefined, 'no-access-token');
    }

    // note: authHeader is in the form 'Bearer ...token...'
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw httpError(UNAUTHORIZED, undefined, 'bad-authorization-header');
    }

    try {
      req.user = await tokenCache.retrieve(token);
      debug(`${req.user.name}[${req.user.roles.join(',')}]: ${token}`);
      next();
    } catch (err) {
      throw httpError(UNAUTHORIZED, undefined, 'expired-token');
    }
  }
};

module.exports = isAuth;
