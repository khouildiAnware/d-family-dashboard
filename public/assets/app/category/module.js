angular.module('karizma.category', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/categories', {
                templateUrl: '/template/category/index',
                controller: 'CategoryController'
            });
    }]);