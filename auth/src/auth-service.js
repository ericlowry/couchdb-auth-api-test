const debug = require('debug')('auth:service');
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favIcon = require('serve-favicon');
const logger = require('morgan');

const pkg = require('../package.json');

const cex = require('../../common/lib/cex');
const globalErrorHandler = require('../../common/lib/global-error-handler');
const httpError = require('../../common/lib/http-error');
const notFoundHandler = require('../../common/lib/not-found-handler');
const uuid = require('../../common/lib/uuid');

const users = require('./lib/users');
const sessionCache = require('./lib/session-cache');
const tokenCache = require('./lib/token-cache');
const refreshCookie = require('./lib/refresh-cookie');
const loadSession = require('./lib/load-session');
const loadUser = require('./lib/load-user');

const PORT = parseInt(process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favIcon(path.join(__dirname, '..', 'public', 'favicon.ico')));

app.use(logger('dev'));

//
// GET / 
//
// Service info
//
app.get(
  '/',
  cex(async (req, res) => {
    return res.send({
      ok: true,
      message: pkg.description,
    });
  })
);

//
// GET /auth/version
//
// Service version info
//
app.get(
  '/auth/version',
  cex(async (req, res) => {
    return res.send({
      ok: true,
      message: pkg.description,
      version: pkg.version,
    });
  })
);

//
// profile(user) : sanitize a user record for use by the client
//
const profile = ({ name, label, roles, email }) => ({
  name,
  label,
  roles,
  email,
});

//
// POST {name,password,data} > /auth/local/login
//
// Authenticate a user and build a session
//
app.post(
  '/auth/local/login',
  cex(async (req, res) => {
    const { name, password, data = {} } = req.body;
    const user = await users.authenticate(name, password);
    const refreshToken = await uuid();
    await sessionCache.create(refreshToken, {
      id: name,
      version: user.version,
      data,
    });
    const accessToken = await uuid();
    await tokenCache.create(accessToken, user);

    refreshCookie.set(res, refreshToken);

    res.send({
      ok: true,
      token: accessToken,
      profile: profile(user),
      data,
    });
  })
);

//
// POST /auth/logout 
// POST {deep: true} > /auth/logout
// 
// Remove a user's session or all of user's sessions (deep)
//
app.post(
  '/auth/logout',
  cex(async (req, res) => {
    const refreshToken = refreshCookie.get(req);
    if (!refreshToken) {
      debug(`logout called without refreshToken`);
    } else {
      const deep = !!req.body.deep;
      debug(`logout ${deep ? '(deep) ' : ''}${refreshToken}`);
      if (req.body.deep) {
        try {
          const session = await sessionCache.retrieve(refreshToken);
          const user = await users.retrieve(session.id);
          if (user.version === session.version) {
            user.version = await uuid();
            await users.update(user);
          }
        } catch (err) {
          console.warn(err);
        }
      }
      debug(`removing session: ${refreshToken}`);
      await sessionCache.delete(refreshToken);
    }
    refreshCookie.clear(res);
    res.send({ ok: true });
  })
);

//
// touchSession() Middleware to reset a session's TTL
//
const touchSession = async (req, res, next) => {
  await sessionCache.setTTL(req.refreshToken);
  next();
};

//
// GET /auth/profile
//
// Return a session's user profile, data and a fresh token
//
app.get(
  '/auth/profile',
  cex(loadSession),
  cex(loadUser),
  cex(touchSession),
  cex(async (req, res) => {
    const accessToken = await uuid();
    await tokenCache.create(accessToken, req.user);
    res.send({
      ok: true,
      token: accessToken,
      profile: profile(req.user),
      data: req.session.data,
    });
  })
);

//
// GET /auth/token
//
// Generate a fresh access token
//
app.get(
  '/auth/token',
  cex(loadSession),
  cex(loadUser),
  cex(touchSession),
  cex(async (req, res) => {
    const accessToken = await uuid();
    await tokenCache.create(accessToken, req.user);
    res.send({
      ok: true,
      token: accessToken,
    });
  })
);

//
// GET /auth/session
//
// Get the current session's data
//
app.get(
  '/auth/session',
  cex(loadSession),
  cex(async (req, res) => {
    res.send({
      ok: true,
      data: req.session.data,
    });
  })
);

//
// POST {data:{...}} > /auth/session 
//
// Update the current sessions data
//
app.post(
  '/auth/session',
  cex(loadSession),
  cex(touchSession),
  cex(async (req, res) => {
    req.session.data = req.body.data || {};
    sessionCache.update(req.refreshToken, req.session);
    res.send({
      ok: true,
    });
  })
);

// 404 handler
app.use(cex(notFoundHandler));

// global error handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`listening on http://0.0.0.0:${PORT}`);
});
