'use strict';
angular.module('sniphub', ['ngRoute','ngMaterial', 'ngAnimate', 'ngAria','ui.router','sniphub.services','sniphub.snippets','sniphub.addSnippet', 'sniphub.auth', 'sniphub.snippetsUser','sniphub.editSnippet','sniphub.angular-ellipsis'])
.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
  //Any state that isn't declared, redirects to snippets
  $urlRouterProvider.otherwise('snippets');
  $stateProvider
    .state('snippets', {
      url: '/snippets',
      controller: 'SnippetsController',
      views: {
        'main' : { templateUrl: 'html/snippets.html' }
      }
    })
    .state('addSnippet', {
      url: '/addSnippet',
      controller: 'AddSnippetController',
      views: {
        'main' : { templateUrl: 'html/addSnippet.html' }
      }
    })
    .state('editSnippet', {
      url: '/users/:id/:snippetId',
      controller: 'EditSnippetController',
      views: {
        'main' : { templateUrl: 'html/editSnippet.html' }
      }
    })
    .state('users', {
      url: '/users/:id',
      controller: 'snippetsUserController',
      views: {
        'main' : { templateUrl: 'html/snippetUser.html'}
      }
    });

})
.factory('colorTheme', function () {
  return {
    elements: {
      body: $(document.body),
      nav: $('nav'),
      themeOption: $('.themeOption')
    },
    theme: 'standard',
    changeTheme: function (theme) {
      if (this.theme !== theme) {
        this.theme = theme;
        this.elements['body'].attr('class', this.theme);
        this.elements['nav'].attr('class', this.theme);
        this.elements['themeOption'].css('color', this.theme === 'standard' ? 'white' : 'red');
      } 
    } 
  };
})
.controller('MainCtrl', ['$scope', 'colorTheme', function ($scope, colorTheme) {
  $scope.theme = colorTheme.theme;
  $scope.changeTheme = colorTheme.changeTheme.bind(colorTheme);
}]);
