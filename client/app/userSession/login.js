'use strict';
angular.module('fantasyGolfApp')
.controller('LoginCtrl', function($scope, Auth, $location){
  $scope.user = {};
  $scope.errors = {};

  $scope.login = function(form){
    $scope.submitted = true;
    var userEmail = $scope.user.email.toLowerCase();

    if(form.$valid){
      Auth.login({
        email:userEmail,
        password: $scope.user.password
      })
      .then(function(){
        $location.path('/myleagues');
      })
      .catch(function(err){
        err = err.data;
        $scope.errors.other = err.message;
      });
    }
  };
});
