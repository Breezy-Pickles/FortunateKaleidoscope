'use strict';
var Promise = require('bluebird');
var db = require('../db/dbconfig');
var User = db.User;
var Snippet = db.Snippet;
var Tag = db.Tag;
var Sequelize = require('Sequelize');

module.exports = {
  findOrCreateUser: function (profile) {
    return new Promise(function (resolve, reject) {
      db.User.findOrCreate({
        where: {
          username: profile.username,
          imgUrl: profile._json.avatar_url,
        }
      }).spread(function (user, created) {
        resolve(user, created);
      }).catch(reject);
    });
  },

  findUserByUsername: function (username) {
    return new Promise(function (resolve, reject) {
      db.User.findOne({
        where: {
          username: username
        }
      }).then(function (user) {
        resolve(user);
      }).catch(function (err) {
        reject('Got an error: ', err);
      });
    });
  },
  // create all associated tag instances in tag table and return in an array
  addTags: function (tags, res) {
    var tags = tags.split(',');

    var createTag = function (tag) {
      return Tag.findOrCreate({
        where: {
          tagname: tag
        }
      }).then(function (tag) {
        return tag[0];
      }).catch( function (err) {
        return console.log(err);
      });
    };

    return Promise.map(tags, createTag)
    .then ( function (tags) {
      return tags;
    })

  },

  writeSnippet: function (tags, req, cb) {
    // takes the array of body tags and turns them into object

    // Parses snippet
    var snippet = escape(req.body.text);
    var languageScope = req.body.scope;
    var snipTitle = escape(req.body.title);
    var tab = escape(req.body.tabPrefix);
    var forkedFrom = req.body.forkedFrom;


    // Building snippet object to create
    var post = {
      text: snippet,
      forkedCount: 0,
      tabPrefix: tab,
      title: snipTitle,
      scope: languageScope,
      forkedFrom: forkedFrom,
      upvote: 0
    };
    // Retrieves user name from request
    var user = req.user.username;

    // Searches for User based on request
    User.findOrCreate({
      where: { username: user }
      // if found, adjusts snippet userId to match found user's id
    }).then(function (result) {
      post.userId = result[0].id;
      Snippet.create(post)
      // populates a join table linking snippet with associated tags
      .then(function (post) {
        post.addTags(tags);
        cb();
      })
    }).catch(cb);
  },

  //returns all tags in the tag table 
  getTags: function () {
    return Tag.findAll({}).then(function (result) {
      return result;
    });
  },

  getSnippet: function (snippetID) {
    return Snippet.findOne({
      where: {
        id: snippetID
      },
      include: [{
        model: User
      }, {
        model: Tag
      }]
    }).then(function (result) {
      return result;
    });
  },

  updateSnippet: function (tags, req) {
    // Parse and sanitize req
    var snippet = escape(req.body.text);
    var languageScope = req.body.scope;
    var snipTitle = escape(req.body.title);
    var tab = escape(req.body.tabPrefix);
    // Building snippet object to create
    var post = {
      text: snippet,
      tabPrefix: tab,
      title: snipTitle,
      scope: languageScope,
    };
    // Update Snippet
    return Snippet.update(post, {
      where: {
        id: req.body.id
      }
    }).then(function (result) {
      // add any additional tags to the snippet
      return Snippet.find({
        where: {
          id: req.body.id
        }
      }).then( function (snippet){
        snippet.addTags(tags);
      })
    });
  },
  getSnippetsMostRecent: function () {
    //Search all snippets, limit 10, ordered by createdAt date
    return Snippet.findAll({
      limit: 10,
      order: 'createdAt DESC',
      include: [{
        model: User
      },
      { model: Tag}]
    }).then(function (result) {
      return result;
    });
  },

  getSnippetsByUser: function (user, cb) {
    User.find({
      where: {
        username: user
      }
    }).then(function (user) {
      var id = user.get('id');
      Snippet.findAll({
        where : {
          userId : id
        },
        include: [{
          model: User
        },{
          model: Tag
        }]
      }).then(function (result) {
        //We are good here;
        cb(null, result);
      }).catch(function (err) {
        cb(err);
      });
    });
  },

  searchSnippets: function (searchTerm) {
    return Promise.map(searchTerm.split(' '), function (term) {
      return db.Snippets.findAll({ include: [{
        model: Tags,
        where: { tagname: term }
      }]});
    });
  }
};
