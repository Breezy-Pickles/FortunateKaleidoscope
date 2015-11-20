// FIX ALL THIS
angular.module('sniphub.snippets', ['hljs'])

.controller('SnippetsController', function (Auth, $scope, $location, SniphubServices) {
  $scope.snippets = [];
  
  $scope.getUsername = function () {
    $scope.loggedInUser = Auth.isAuth('username');
  }

  $scope.fetchTopTen = function () {
    //call factory function
    SniphubServices.fetchTopTen()
      .then(function ( snippets ) {
        console.log('return from fetch', snippets.data[0].tags);
        $scope.snippets = snippets.data;
        $scope.snippets.forEach(function (item) {
          item.text = unescape(item.text);
          item.title = unescape(item.title);
          item.tags = item.tags;
        });
      });
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
  });

});
