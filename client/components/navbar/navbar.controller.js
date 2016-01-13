'use strict';

angular.module('chewyshopApp')
    // With the $rootScope dependency, we can catch any change in the event on the search form and broadcast it.
    .controller('NavbarCtrl', function ($scope, $rootScope, $state, $window, $timeout) {
        $scope.menu = [{
            'title': 'Home',
            'state': 'main'
        }, {
            'title': 'Products',
            'state': 'products'
        }];


        // Broadcast an event when anything on the search form is typed.
        $scope.search = function () {
            $rootScope.$broadcast('search:term', $scope.searchTerm);
        };

        $scope.redirect = function () {
            $state.go('products');
            // timeout makes sure that it is invoked after any other event has been triggered.
            $timeout(function () {
                // focus on search box
                var searchBox = $window.document.getElementById('searchBox');
                if(searchBox){ searchBox.focus(); }
            })
        };
    });
