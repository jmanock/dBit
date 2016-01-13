'use strict';

angular.module('chewyshopApp')
.controller('NavbarCtrl', function($scope, $rootScope, $state, $window, $timeout){
  $scope.menu =[{
    'title':'Home',
    'state':'main'
  },{
    'title':'Products',
    'state':'products'
  }];

  $scope.search = function(){
    $rootScope.$broadcast('search:term', $scope.searchTerm);
  };

  $scope.redirect = function(){
    $state.go('products');
    $timeout(function(){
      var searchBox = $window.document.getElementById('searchBox');
      if(searchBox){
        searchBox.focus();
      }
    });
  };
});
