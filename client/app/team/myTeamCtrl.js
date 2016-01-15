'use strict';
angular.module('fantasyGolfApp')
.controller('myTeamCtrl', function($scope, $q, $routeParams, pga, Team){
  var totalRounds;
  $scope.rounds = [];
  $q.all([
    Team.getMyTeam($scope.currentUser.teamId),
    pga.getSetup()
  ])
  .then(function(result){
    $scope.team = result[0].data;
    $scope.tournament = result[1].data;
    totalRounds = result[1].data.totalRounds;

    if(totalRounds){
      while(totalRounds > $scope.rounds.length){
        $scope.rounds.push({number: ($scope.rounds.length + 1)});
      }
    }
    angular.forEach([$scope.team.player1, $scope.team.player2, $scope.team.player3, $scope.team.player4], function(playerData){
      if(playerData){
        while(playerData.rounds.length < totalRounds){
          playerData.rounds.push({
            modStablefordTotal:''
          });
        }
      }
    });
  });
});
