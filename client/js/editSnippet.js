angular.module('sniphub.editSnippet', [])

.controller('EditSnippetController', function (Auth, $scope, $state, $stateParams, $location, SniphubServices) {
  
  $scope.params = $stateParams;

  $scope.fetchSnippetById = function (user, id) {
  //fetch the snippet by provided snippet id;
    SniphubServices.fetchBySnippetId( user, id ).then(function (snippet) {
      //Populates input fields with data from snippet
      $scope.snippet = snippet.data;
      var tags = "";
      for(var i=0; i<snippet.data.tags.length; i++) {
          tags = tags + snippet.data.tags[i].tagname;
        if(i < snippet.data.tags.length-1){
          tags = tags +', ';
        }
      }
      console.log(tags);
      $scope.inputEntry = unescape($scope.snippet.text);
      $scope.titleField = $scope.snippet.title;
      $scope.tabField = $scope.snippet.tabPrefix;
      $scope.scope = $scope.snippet.scope;
      $scope.userField = Auth.isAuth('username');
      $scope.snippetId = $scope.snippet.id;
      $scope.tagField = tags;
    });
  };

  $scope.updateSnippet = function (snippetId, user, text, title, tabPrefix, scope, tag) {
    var tag = tag.replace(/,\s+/g, ',').replace(/\s+,/g, '');
    SniphubServices.updateSnippet(snippetId, user, text, title, tabPrefix, scope, tag).then(function (response) {
      // changes state on completion
      $state.go('snippets');
    });
  };

  $scope.$watch('$viewContentLoaded', function () {
    $scope.fetchSnippetById($scope.params.id, $scope.params.snippetId);
  });
});
