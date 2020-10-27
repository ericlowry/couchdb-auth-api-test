const debug = require('debug')('api:/user');
const express = require('express');
const cex = require('../../../common/lib/cex');
const hasRole = require('../lib/has-role');
const users = require('../lib/users');

const router = express.Router();

const PART = 'org.couchdb.user';
const TYPE = 'user';

//////////////////////////////////////////////////////////////////////
//
// GET /api/user/:id - return a user's record
//
router.get(
  '/:id',
  cex(hasRole('ADMIN')),
  cex(async (req, res) => {
    const user = await users.retrieve(req.params.id)
    res.send({ ok: true, user })
  })
);

//////////////////////////////////////////////////////////////////////
//
// GET /api/user - return all users
//
router.get(
  '/',
  cex(hasRole('ADMIN')),
  cex(async (req,res)=>{
    const docs = await users.retrieveAll();
    res.send({ ok: true, users: docs });
  })
);

module.exports = router;
