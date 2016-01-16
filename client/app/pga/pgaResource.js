'use strict';
angular.module('fantasyGolfApp')
.factory('pga', function($http, promiseCache){
  return{
    getLeaderboard:function(){
      return promiseCache({
        promise:function(){
          return $http.get('/api/pga/leaderboard');
        },
        ttl:900000
      });
    },
    getPlayer:function(playerId){
      return $http.get('/api/pga/player' +playerId);
    },
    getField:function(){
      return promiseCache({
        promise:function(){
          return $http.get('/api/pga/field');
        },
        ttl:360000
      });
    },
    getSetup:function(){
      return promiseCache({
        promise:function(){
          return $http.get('/api/pga/setup');
        },
        ttl:3600000
      });
    }
  };
});
