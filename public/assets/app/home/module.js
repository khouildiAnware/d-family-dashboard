angular.module('karizma.home', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/template/home/index',
                controller: 'HomeController'
            });
    }]);