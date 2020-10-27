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

const isAuth = require('./lib/is-auth');
const hasRole = require('./lib/has-role');

const userRoute = require('./routes/user-route');
const widgetRoute = require('./routes/widget-route');

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
  '/api/version',
  cex(async (req, res) => {
    return res.send({
      ok: true,
      message: pkg.description,
      version: pkg.version,
    });
  })
);

app.get(
  '/api/test',
  cex(hasRole('ADMIN')),
  cex(async (req, res) => {
    res.send({ ok: true, msg: 'made it!' });
  })
);

app.use('/api/user', userRoute);
app.use('/api/widget', widgetRoute);

// 404 handler
app.use(cex(notFoundHandler));

// global error handler must be last...
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`listening on http://0.0.0.0:${PORT}`);
});
