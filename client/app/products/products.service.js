'use strict';

angular.module('chewyshopApp')
    .factory('Product', function ($resource) {
        return $resource('/api/products/:id/:controller', null, {
            // Added the update action, because the default actions do not include it.
            'update': {method: 'PUT'},
            'catalog': {
                method: 'GET', isArray: true,
                params: {
                    controller: 'catalog'
                }
            },
            'search': {
                method: 'GET', isArray: true,
                params: {
                    controller: 'search'
                }
            }
        });
    });