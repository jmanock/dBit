'use strict';

angular.module('chewyshopApp')
    .controller('MainCtrl', function ($scope, $http, socket, Product) {
        $scope.products = Product.query();
    });
