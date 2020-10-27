const debug = require('debug')('api:/user');
const express = require('express');
const cex = require('../../../common/lib/cex');
const hasRole = require('../lib/has-role');
const nano = require('nano');
const docController = require('../../../common/lib/db-doc-controller');

const router = express.Router();
const dataDB = nano(process.env.DATADB);
const widgets = docController(dataDB, 'WIDGET');

//////////////////////////////////////////////////////////////////////
//
// GET /api/widget - return all widgets
//
router.get(
  '/',
  cex(hasRole('USER')),
  cex(async (req, res) => {
    const docs = await widgets.retrieveAll();
    res.send({ ok: true, widgets: docs });
  })
);

//////////////////////////////////////////////////////////////////////
//
// HEAD /api/widget/:id - check if a widget exists
//
router.head(
  '/:id',
  cex(hasRole('USER')),
  cex(async (req, res) => {
    const exists = await widgets.retrieve(req.params.id);
    res.send({ ok: true });
  })
);

//////////////////////////////////////////////////////////////////////
//
// GET /api/widget/:id - return a widget
//
router.get(
  '/:id',
  cex(hasRole('USER')),
  cex(async (req, res) => {
    const doc = await widgets.retrieve(req.params.id);
    res.send({ ok: true, widget: doc });
  })
);

module.exports = router;
