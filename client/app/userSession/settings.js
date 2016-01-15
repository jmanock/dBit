'use strict';
angular.module('fantasyGolfApp')
.controller('SettingsCtrl', function($scope, Auth){
  $scope.errors = {};
  $scope.changePassword = function(form){
    $scope.submitted = true;
    if($scope.SettingsForm.$valid){
      Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
      .then(function(){
        $scope.message = 'Password successfully changed';
      })
      .catch(function(){
        form.password.$setValidity('mongoose', false);
        $scope.errors.other = 'Incorrect password';
      });
    }
  };
});
