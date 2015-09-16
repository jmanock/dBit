(function() {
  'use strict';

  angular
    .module('dBit')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'mainVm'
      })
      .state('login',{
        url:'/login',
        templateUrl:'app/main/main.html',
        controller:'loginController',
        controllerAs:'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

})();
