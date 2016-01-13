'use strict';

// This controller pulls out all the product categories from products.
// A service (sidebar.service.js) retrieves the categories from the database.
angular.module('chewyshopApp')
    .controller('SidebarCtrl', function ($scope, Catalog, $location) {
        $scope.catalog = Catalog.query();

        $scope.isActive = function(route) {
            return $location.path().indexOf(route) > -1;
        };
    });