'use strict';

var errorHandler, uploadHandler;

angular.module('chewyshopApp')
    // Inject our `Products` factory into the controller.
    .controller('ProductsCtrl', function ($scope, Product) {
        // Create new variable `$scope.products` so that `products` becomes available in the view as well.
        $scope.products = Product.query();

        // Listen to the event that's being broadcasted every time the search form changes.
        $scope.$on('search:term', function (event, data) {
            if(data.length) {
                $scope.products = Product.search({id: data});
                $scope.query = data;
            } else {
                $scope.products = Product.query();
                $scope.query = '';
            }
        });
    })

    .controller('ProductCatalogCtrl', function ($scope, $stateParams, Product) {
        $scope.products = Product.catalog({id: $stateParams.slug});
        $scope.query = $stateParams.slug;
    })
    /*
     * We are injecting new dependencies besides the $scope and Products service,
     * such as $state and $stateParams. The first one allows us to redirect to a different
     * state or route, while $stateParams is an object that contains all the variables
     * from the URL (for example, product id).
     */

    .controller('ProductViewCtrl', function ($scope, $state, $stateParams, Product) {
        $scope.product = Product.get({id: $stateParams.id});
        $scope.deleteProduct = function () {
            Product.delete({id: $scope.product._id}, function success(/* value, responseHeaders */) {
                $state.go('products');
            }, errorHandler($scope));
        };
    })

    .controller('ProductNewCtrl', function ($scope, $state, Product) {
        $scope.product = {}; // create a new instance
        $scope.addProduct = function () {
            Product.save($scope.product, function success(value /*, responseHeaders*/) {
                $state.go('viewProduct', {id: value._id});
            }, errorHandler($scope));
        };
    })

    .controller('ProductEditCtrl', function ($scope, $state, $stateParams, Product, Upload, $timeout) {
        $scope.product = Product.get({id: $stateParams.id});
        $scope.editProduct = function () {
            Product.update({id: $scope.product._id}, $scope.product, function success(value /*, responseHeaders*/) {
                $state.go('viewProduct', {id: value._id});
            }, errorHandler($scope));
        };

        $scope.upload = uploadHandler($scope, Upload, $timeout);
    });

errorHandler = function ($scope) {
    return function error(httpResponse) {
        $scope.errors = httpResponse;
    };
};

uploadHandler = function ($scope, Upload, $timeout) {
    return function (file) {
        if (file && !file.$error) {
            $scope.file = file;
            file.upload = Upload.upload({
                url: '/api/products/' + $scope.product._id + '/upload',
                file: file
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) {
                    console.log(response.status + ': ' + response.data);
                    errorHandler($scope)(response.status + ': ' + response.data);
                }
            });

            file.upload.progress(function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
};