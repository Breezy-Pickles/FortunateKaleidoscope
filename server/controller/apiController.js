'use strict';
var dummyData = require('../../test/dummyData');
var helpers = require('../lib/helpers');

module.exports = {
  getTopTen: function (req, res) {
    helpers.getSnippetsMostRecent().then(function (snips) {
      var resSnips = snips.map(function (snip) {
        return snip.toJSON();
      });
      res.json(resSnips);
    }).catch(function (err) {
      res.sendStatus(501, err);
    });
  },
  searchSnips: function (req, res) {
    // TODO: Search snips by tag
    // helpers.searchSnippets()
    res.json(dummyData);
  },
  writeSnippet: function (req, res) {
    var tags = req.body.tags;
    helpers.addTags(tags)
    .then (function (tags) {
      helpers.writeSnippet(tags, req, function() {
        res.json({created:true});
      })
    })
  }

};
