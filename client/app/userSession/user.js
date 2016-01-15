'use strict';
angular.module('fantasyGolfApp')
.factory('User', function($resource){
  return $resource('/api/users/:id', {
    id:'@id'
  }, {
    update:{
      method:'PUT',
      params:{}
    },
    get:{
      method:'GET',
      params:{
        id:'me'
      }
    }
  });
});
