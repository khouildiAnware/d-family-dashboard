angular.module('karizma.new', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/news', {
                templateUrl: '/template/new/index',
                controller: 'NewController'
            });
    }]);