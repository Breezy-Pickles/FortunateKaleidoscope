'use strict';
// /api route
var express = require('express');
var apiController = require('../controller/apiController');
var authMiddleware = require('../config/authMiddleware').authMiddleware;
var userRoute = express.Router();

module.exports = function (app) {
  app.get('/topten', apiController.getTopTen);
  app.get('/tags', apiController.getTags);
  app.post('/search', apiController.searchSnips);
  app.post('/snippet', authMiddleware, apiController.writeSnippet);
  app.use('/user', userRoute);
  require('./userRoute')(userRoute);
};
