var request = require('supertest');
var expect = require('../node_modules/chai/chai').expect;
var db = require('../server/db/dbconfig');
var Sequelize = require('sequelize');

describe("User Table", function () {
  beforeEach(function ( done ) {
    var sequelize = new Sequelize('sniphub', 'root', 'test');
    db.User.destroy({ where: {
      username: "fred"
    } });
    sequelize.sync({force: true})
    .then( function () {
      done();
    });
  });


  it("Should allow users to be created", function (done) {
    db.User.create({username: "fred"}).then(function () {
      db.User.findOne({ where: { username : "fred"} }).then(function (user) {
        expect(user.username).to.equal('fred');
        done();
      });
    });
  });

  it("Should allow users to be deleted", function (done) {
    db.User.create({username: "fred"})
    .then( function () { db.User.destroy({ where: { username: "fred" } }) })
    .then( function () { db.User.findOne({ where: { username: "fred" } }) })
    .then( function (user) {
          expect(user).to.equal(undefined);
          done();
    });
  });

describe("Snippets Table", function () {
  beforeEach(function ( done ) {
    var sequelize = new Sequelize('sniphub', 'root', 'test');
    db.Snippet.destroy({ where: { text: "awesome text snippet"}
    });
    sequelize.sync({force: true})
    .then( function () {
      done();
    });
});

    it("Should allow snippets to be created", function (done) {
      db.Snippet.create({text: "awesome text snippet", forkedCount: 1}).then(function () {
        db.Snippet.findOne({ where: { text : "awesome text snippet" } }).then(function (snippet) {
          expect(snippet.text).to.equal("awesome text snippet");
          expect(snippet.forkedCount).to.equal(1);
          done();
        });
      });
    });

    it("Should allow snippets to be deleted", function (done) {
      db.Snippet.create({text: "awesome text snippets", forkedCount: 1})
      .then( function () { db.Snippet.destroy({ where: { text: "awesome text snippets" } }) })
      .then( function () { db.Snippet.findOne({ where: { text: "awesome text snippets" } }) })
      .then( function (snippet) {
          expect(snippet).to.equal(undefined);
          done();
      });
    });
  });

  describe("Tags Table", function () {
    beforeEach(function ( done ) {
      var sequelize = new Sequelize('sniphub', 'root', 'test');
      db.Tag.destroy({ where: { tagname: "javascript"}
      });
      sequelize.sync({force: true})
      .then( function () {
        done();
      });
  });

    it("Should allow tags to be created", function (done) {
      db.Tag.create({tagname: "javascript" }).then(function () {
        db.Tag.findOne({ where: { tagname : "javascript" } }).then(function (tag) {
          expect(tag.tagname).to.equal("javascript");
          done();
        });
      });
    });

    it("Should allow tags to be deleted", function (done) {
      db.Tag.create({tagname: "javascript", forkedCount: 1})
      .then( function () { db.Tag.destroy({ where: { tagname: "javascript" } }) })
      .then( function () { db.Tag.findOne({ where: { tagname: "javascript" } }) })
      .then( function (tag) {
          expect(tag).to.equal(undefined);
          done();
      });
    });
  });

describe("Integration of tables", function () {

  beforeEach(function ( done ) {
    var sequelize = new Sequelize('sniphub', 'root', 'test');
    sequelize.sync({force: true}).then( function () {
      done();
    });
  });

  it("Should have tags associated with snippets in snippet_tag table", function (done) {
    db.Tag.create({tagname: "Testing"})
    .then( function (tag) {
      db.Snippet.create({text: "awesome text snippets", forkedCount: 1})
      .then(function (snippet) {
        snippet.addTags(tag)
        .then(function () {
          db.Snippet.findOne({}, include:[{model:Tag}]})
          .then(function (snippet){
            expect(snippet.forkedCount).to.equal(1);
            done();
          })
        })
      })
    })
  })

  it("Should correctly link associations across tables", function (done) {
    var post = {
      text: "test",
      forkedCount: 0
    };
    var user = "fred"
    // Searches for User based on request
    db.User.findOrCreate({
      where: { username: user }
      // if found, adjusts snippet userId to match found user's id
    }).then(function (result) {
      post.userId = result[0].id;
      db.Snippet.create(post).then(function(post){
        expect(post.get('text')).to.equal("test");
        expect(post.get('userId')).to.equal(post.userId);
        expect(post.get('forkedCount')).to.equal(0);
        done();
        });
      });
    });
  });
});
