angular.module('karizma.work', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/works', {
                templateUrl: '/template/work/index',
                controller: 'WorkController'
            });
    }]);