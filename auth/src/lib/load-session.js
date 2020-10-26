//
// load-session.js - Middleware for loading a session into req.session
//
const debug = require('debug')('auth:load-session');
const { UNAUTHORIZED } = require('http-status-codes');
const refreshCookie = require('./refresh-cookie');
const sessionCache = require('./session-cache');
const httpError = require('./http-error');

const loadSession = async (req, res, next) => {
  // get the refreshToken from the cookie... (if any)
  req.refreshToken = refreshCookie.get(req);

  // did we get a refresh token?
  if (!req.refreshToken) {
    // ...nope, nothing to do.
    throw httpError(UNAUTHORIZED, undefined, 'No Session');
  }

  debug(`refreshToken: ${req.refreshToken}`);
  try {
    req.session = await sessionCache.retrieve(req.refreshToken);
    debug(req.session);
    await sessionCache.setTTL(req.refreshToken);
    next();
  } catch (err) {
    throw httpError(UNAUTHORIZED, undefined, 'Session Has Expired');
  }
};

module.exports = loadSession;
