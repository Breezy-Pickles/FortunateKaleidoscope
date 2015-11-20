angular.module('sniphub.editSnippet', [])

.controller('EditSnippetController', function (Auth, $scope, $state, $stateParams, $location, SniphubServices) {
  
  $scope.params = $stateParams;

  $scope.fetchSnippetById = function (user, id) {
  //fetch the snippet by provided snippet id;
    SniphubServices.fetchBySnippetId( user, id ).then(function (snippet) {
      //Populates input fields with data from snippet
      $scope.snippet = snippet.data;
      $scope.inputEntry = unescape($scope.snippet.text);
      $scope.titleField = $scope.snippet.title;
      $scope.tabField = $scope.snippet.tabPrefix;
      $scope.scope = $scope.snippet.scope;
      $scope.userField = Auth.isAuth('username');
      $scope.snippetId = $scope.snippet.id;
    });
  };

  $scope.updateSnippet = function (snippetId, user, text, title, tabPrefix, scope, tag) {
    SniphubServices.updateSnippet(snippetId, user, text, title, tabPrefix, scope, tag).then(function (response) {
      // changes state on completion
      $state.go('snippets');
    });
  };

  $scope.$watch('$viewContentLoaded', function () {
    $scope.fetchSnippetById($scope.params.id, $scope.params.snippetId);
  });
});
