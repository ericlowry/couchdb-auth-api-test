//
// db-doc-controller.js
//
const assert = require('assert');

module.exports = (db, type, part = type) => {
  const _id = (id) => `${part}:${id}`;
  return {
    create: (id, doc) => {
      assert(!doc._id, 'doc._id exists');
      assert(!doc._rev, 'doc._rev exists');
      doc._id = _id(id);
      return db.insert(doc);
    },

    retrieve: (id) =>
      db.get(_id(id)).then((doc) => {
        assert(doc.type === type, `Unexpected doc type ${doc.type}`);
        return doc;
      }),

    update: (doc) => {
      assert(doc._id, 'missing doc._id');
      assert(doc._rev, 'missing doc._rev');
      return db.insert(doc);
    },

    delete: (id, rev) => db.destroy(_id(id), rev),
  };
};
