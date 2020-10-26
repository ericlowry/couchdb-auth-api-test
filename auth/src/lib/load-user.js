//
// load-user.js - Middleware for loading a session's user into req.user
//
const debug = require('debug')('auth:load-user');
const assert = require('assert');
const users = require('./users');

const loadUser = async (req,res,next) => {
  assert(req.session && req.session.id);
  req.user = await users.retrieve(req.session.id);
};

module.exports = loadUser;
