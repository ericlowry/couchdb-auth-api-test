//
// cex(): middleware wrapper for catching exceptions
//
// for more info, see:
// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
//
const cex = (fn) =>
  Array.isArray(fn)
    ? fn.map((_fn) => (...args) => _fn(...args).catch(args[2]))
    : (...args) => fn(...args).catch(args[2]);

module.exports = cex;
