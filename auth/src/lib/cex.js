//
// cex(): middleware wrapper for catching exceptions
//
const cex = (fn) => (...args) => fn(...args).catch(args[2]);

module.exports = cex;
