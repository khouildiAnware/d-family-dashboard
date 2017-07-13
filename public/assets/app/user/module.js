angular.module('karizma.user', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/users', {
                templateUrl: '/template/user/index',
                controller: 'UserController'
            }).when('/users/:id', {
                templateUrl: '/template/user/edit',
                controller: 'EditUserController',
                resolve: {
                    user: function ($route, User) {
                        return User.get($route.current.params.id, null, true);
                    }
                }
            });
    }]);