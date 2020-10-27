const { generate } = require('short-uuid');

//
// uuid(part):
//
// Generate a short UUID with an optional partition name
//
module.exports = part => (part ? part + ':' : '') + generate();
