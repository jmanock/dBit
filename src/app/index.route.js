(function() {
  'use strict';

  angular
    .module('dBit')
    .constant('FirebaseUrl', 'https://toga.firebaseio.com')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      // .state('home', {
      //   url: '/',
      //   templateUrl: 'app/main/main.html',
      //   controller: 'MainController',
      //   controllerAs: 'main'
      // });
      .state('home', {
        url:'/home',
        templateUrl:'app/main/main.html'
      })
      .state('authenticated', {
        url:'/authenticated',
        templateUrl:'app/partial-authenticated.html',
        resolve:{
          'currentAuth':['$firebaseAuth', function($firebaseAuth){
            var ref = new Firebase(FirebaseUrl);
            var authObj = $firebaseAuth(ref);
            return authObj.$requireAuth();
          }]
        }
      });

    $urlRouterProvider.otherwise('/home');
  }

})();
