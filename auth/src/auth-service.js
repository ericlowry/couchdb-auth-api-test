const debug = require('debug')('auth:service');
const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favIcon = require('serve-favicon');
const logger = require('morgan');
const { getStatusText } = require('http-status-codes');

const pkg = require('../package.json');

const cex = require('./lib/cex');
const httpError = require('./lib/http-error');
const users = require('./lib/users');
const uuid = require('./lib/uuid');
const sessionCache = require('./lib/session-cache');
const tokenCache = require('./lib/token-cache');
const refreshCookie = require('./lib/refresh-cookie');
const loadSession = require('./lib/load-session');

const PORT = parseInt(process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favIcon(path.join(__dirname, '..', 'public', 'favicon.ico')));

app.use(logger('dev'));

app.get(
  '/',
  cex(async (req, res) => {
    return res.send({
      ok: true,
      message: pkg.description,
    });
  })
);

app.get(
  '/version',
  cex(async (req, res) => {
    return res.send({
      ok: true,
      message: pkg.description,
      version: pkg.version,
    });
  })
);

const profile = ({ name, label, roles, email }) => ({
  name,
  label,
  roles,
  email,
});

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
          if ( user.version === session.version ) {
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

// 404 handler
app.use(
  cex((req) => {
    throw httpError(
      403,
      'Not Found',
      `no route to (${req.method}) ${req.path}`
    );
  })
);

// global error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status === 500) {
    console.error(err);
  }

  res.status(status).send({
    ok: false,
    status,
    error: err.error || err.message || getStatusText(status),
    reason: err.reason || err.code,
  });
});

app.listen(PORT, () => {
  console.log(`listening on http://0.0.0.0:${PORT}`);
});
