//
// httpError() - construct a new HTTP Error
//
const httpError = (status, message, reason = undefined) => {
  const err = new Error(message);
  err.status = status;
  err.reason = reason;
  return err;
};

module.exports = httpError;
