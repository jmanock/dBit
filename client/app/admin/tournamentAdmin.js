'use strict';
angular.module('fantasyGolfApp')
.controller('tournamentAdminCtrl', function($scope, Tournament){
  $scope.editPlayerId = 0;
  Tournament.getTournament()
  .then(function(resluts){
    $scope.tournament = angular.copy(resluts.data);
  }, function(error){
    $scope.tournamentError = error;
  });

  Tournament.listUsers()
  .then(function(result){
    $scope.users = result.data;
  }, function(error){
    $scope.uesersError = error;
  });

  $scope.updateTournament = function(tournamnetId, tournament){
    Tournament.updateTournament(tournamnetId, tournament)
    .then(function(result){
      $scope.updateResponse = result.data;
      $scope.TounamentForm.$setPristine();
    }, function(error){
      $scope.updateError = error.data;
      $scope.updateError.status = error.status;
      $scope.TournamentForm.$setPristine();
    });
  };

  $scope.deleteUser = function(userId){
    Tournament.deleteUser(userId)
    .then(function(results){
      $scope.users = results.data;
    }, function(error){
      $scope.userError = error;
    });
  };

  $scope.runSetup = function(){
    Tournament.runSetup()
    .then(function(result){
      $scope.setupResponse = result.data;
    }, function(error){
      $scope.setupError = error;
    });
  };

  $scope.runRefreshSetup = function(){
    Tournament.refreshSetup()
    .then(function(result){
      $scope.refreshSetupResponse = result.data;
    }, function(error){
      $scope.refreshSetupError = error;
    });
  };

  $scope.calcPlayerScores = function(){
    Tournament.calcPlayers()
    .then(function(result){
      $scope.playerResponse = result.data;
    }, function(error){
      $scope.playerError = error;
    });
  };

  $scope.calcTeamScores = function(){
    Tournament.calcTeams()
    .then(function(reslut){
      $scope.teamResponse = reslut.data;
    }, function(error){
      $scope.teamError = error.data;
      $scope.teamError.status = error.status;
    });
  };

  $scope.calcLeagues = function(){
    Tournament.calcLeagues()
    .then(function(result){
      $scope.leagueResponse = result.data;
    }, function(error){
      $scope.leagueError = error.data;
      $scope.leagueError.status = error.status;
    });
  };
});
