//this file is all done ---- dont mess with it

angular.module('sniphub.services', [])

.factory('SniphubServices', function ($http) {

  // grabs all the tags from tag table 
  var fetchTags = function () { 
    return $http({
      method: 'GET',
      url:'/api/tags'
    }).then( function successCallback (response) {
      return response;
    }, function errorCallback (response) {
      console.log('Error in getting tags from db');
    });
  };

  // grabs all snippets from database 
  var fetchTopTen = function () {
    return $http({
      method: 'GET',
      url: '/api/topten'
    }).then(function successCallback ( response ) {
      //store all links in scope.data
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db');
    });
  };

  // add snippet with associated tags to database
  var addSnippet = function ( user, text, title, tabPrefix, scope, tags, forkedFrom) {
    //If it doesn't have a forkedFrom, set to null
    forkedFrom = forkedFrom || null;
    console.log('these are the params', arguments);
    return $http({
      method: 'POST',
      url: '/api/snippet',
      data: {
        "username" : user,
        "text" : text,
        "tabPrefix" : tabPrefix,
        "title" : title,
        "scope" : scope,
        "tags" : tags,
        "forkedFrom" : forkedFrom
       }
    }).then(function successCallback ( response ) {
      console.log("after success");
      return response;
    });
  };

  // updates snippets with associated tags in database
  var updateSnippet = function ( snippetId, user, text, title, tabPrefix, scope, tags, forkedFrom) {
    forkedFrom = forkedFrom || null;
    return $http({
      method: 'POST',
      url: '/api/user/' + user + '/' + snippetId,
      data: {
        "username" : user,
        "text" : text,
        "tabPrefix" : tabPrefix,
        "title" : title,
        "scope" : scope,
        "tags" : tags,
        "forkedFrom" : forkedFrom
       }
    }).then(function successCallback ( response ) {
      console.log("after success");
      return response;
    });

  };

  //fetches all snippets associated with current user
  var fetchByUser = function ( user ) {
    // /api/user/:userId ->
    return $http({
      method: 'GET',
      url: '/api/user/' + user,
    }).then(function successCallback ( response ) {
      //store all links in scope.data
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db');
    });
  };

  // grabs a specific snippet from database by id 
  var fetchBySnippetId = function ( user, id ) {
    return $http({
      method: 'GET',
      url: '/api/user/' + user + '/' + id
    }).then(function successCallback ( response ) {
      return response;
    }, function errorCallback ( response ) {
      console.log('Error in getting snippets from db')
    });
  };

  var tags = [];
  return {
    updateSnippet: updateSnippet,
    fetchBySnippetId: fetchBySnippetId,
    fetchTopTen : fetchTopTen,
    addSnippet : addSnippet,
    fetchByUser: fetchByUser,
    fetchTags: fetchTags,
    tags: tags
  };
})
.factory('Auth', function ($http, $location, $window) {

  //Parse the cookie based on parameter and return the result
  var isAuth = function ( parameter ) {
    var isAuth = document.cookie.split( ';' )
                .map( function( x ) { return x.trim().split( '=' ); } )
                .reduce(function( a, b ) { a[ b[ 0 ] ] = b[ 1 ]; return a; },
                {} )[ parameter ];
    return isAuth;
  };



  return {
    isAuth: isAuth,
  };
});
