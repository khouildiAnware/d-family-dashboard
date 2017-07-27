angular.module('karizma.participation', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/participation', {
                templateUrl: '/template/participation/index',
                controller: 'ParticipController'
            });
    }]);