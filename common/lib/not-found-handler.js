
const httpError = require('./http-error');

module.exports = (req) => {
  throw httpError(
    404,
    'Not Found',
    `no route to (${req.method}) ${req.path}`
  );
}
