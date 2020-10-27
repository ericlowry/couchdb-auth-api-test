//
// cex(): middleware wrapper for catching exceptions
//
const cex = (fn) =>
  Array.isArray(fn)
    ? fn.map((_fn) => (...args) => _fn(...args).catch(args[2]))
    : (...args) => fn(...args).catch(args[2]);

module.exports = cex;
