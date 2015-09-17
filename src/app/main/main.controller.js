(function() {
  'use strict';

  angular
    .module('dBit')
    .controller('MainController', MainController);

  /** @ngInject */
  MainController.$inject = ['$state'];
  function MainController($state) {
    var vm = this;
    vm.navigatTo = function($state){
      $state.go(state);
    };

  }
})();
