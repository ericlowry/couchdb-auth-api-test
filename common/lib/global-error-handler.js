//
// global-error-handler.js : common endpoint for errors
//

const { getStatusText } = require('http-status-codes');

module.exports = (err, req, res, next) => {
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
};
