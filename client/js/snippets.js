// FIX ALL THIS
angular.module('sniphub.snippets', ['hljs'])

.controller('SnippetsController', function (Auth, $scope, $state, SniphubServices) {
  $scope.snippets = [];


  $scope.fetchTags = function () {
    SniphubServices.fetchTags().then( function (response) {
      for(var i=0; i<response.data.length; i++){
        if(SniphubServices.tags.indexOf(response.data[i]) === -1){
          SniphubServices.tags.push(response.data[i]);
        }
      }
    });
    $scope.tags = SniphubServices.tags;
  };
  
  $scope.getUsername = function () {
    $scope.loggedInUser = Auth.isAuth('username');
  };

  $scope.fetchTopTen = function () {
    //call factory function
    SniphubServices.tags = [];
    SniphubServices.fetchTopTen()
      .then(function ( snippets ) {
        $scope.snippets = snippets.data;
        $scope.snippets.forEach(function (item) {
          console.log(SniphubServices.tags);
          item.text = unescape(item.text);
          item.title = unescape(item.title);
          SniphubServices.tags.push(item.title);
          item.tags = item.tags;
        });
      });
  };

  $scope.filter = function (tag) {
    $scope.searchText = tag.tagname;
  };

  $scope.forkSnippet = function ( user, text, title, tabPrefix, scope, tag, forkedFrom ) {
    //calls the auth cookie parser to get the currently logged in username.
    user = $scope.loggedInUser
    // Only forks if the user is not the same as the forked from.
    if ( user !== forkedFrom ) {
      //call the factory function with new user and forkedFrom data
      SniphubServices.addSnippet( user, text, title, tabPrefix, scope, tag, forkedFrom ).then(function ( response ) {
        $scope.fetchTopTen();
      });
    }
  };

  //call once upon app load
  $scope.$watch('$viewContentLoaded', function () {
    $scope.getUsername();
    $scope.fetchTopTen();
    $scope.fetchTags();
  });

});
