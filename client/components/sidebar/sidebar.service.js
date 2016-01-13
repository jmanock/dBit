'use strict';

angular.module('chewyshopApp')
    .factory('Catalog', function ($resource) {
        return $resource('/api/catalogs/:id');
    });