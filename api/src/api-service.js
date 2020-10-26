const path = require('path');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const favIcon = require('serve-favicon');
const logger = require('morgan');
const pkg = require('../package.json');

const { cex } = require('./lib');

const PORT = parseInt(process.env.PORT || 3000);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(favIcon(path.join(__dirname, '..', 'public', 'favicon.ico')));

app.use(logger('dev'));

const APIError = (status, message, reason = undefined) => {
  const err = new Error(message);
  err.status = status;
  err.reason = reason;
  return err;
};

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

// 404 handler
app.use(
  cex((req) => {
    throw APIError(403, 'Not Found', `no route to (${req.method}) ${req.path}`);
  })
);

// global error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const className = err.constructor.name;
  if (status === 500) {
    console.error(err);
  }

  res.status(status).send({
    ok: false,
    status,
    error: err.message || err.toString(),
    reason: err.reason || err.code,
    class: className,
  });
});

app.listen(PORT, () => {
  console.log(`listening on http://0.0.0.0:${PORT}`);
});
