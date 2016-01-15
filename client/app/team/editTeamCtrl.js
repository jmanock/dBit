'use strict';
angular.module('fantasyGolfApp')
.controller('editTeamCtrl', function($scope, $q, pga, Team){
  $q.all([
    Team.getMyTeam($scope.currentUser.teamId),
    pga.getField(),
    pga.getSetup()
  ])
  .then(function(result){
    $scope.team = angular.copy(result[0].data);
    $scope.field = result[1].data;
  });
  $scope.saveTeam = function(team){
    team.userId = $scope.currentUser.userId;
    Team.updateTeam(team, team._id)
    .then(function(response){
      $scope.team = angular.copy(response.data);
      $scope.teamForm.$setPristine();
      $scope.updated = true;
      $scope.showSettings = false;
    },function(error){$scope.teamError = error;});
  };
  $scope.cancel = function(){
    Team.getMyTeam($scope.currentUser.teamId)
    .then(function(result){
      $scope.team = angular.copy(result.data);
      $scope.TeamForm.$setPristine();
      $scope.updated = false;
    },function(error){$scope.teamError = error;});
  };
});
