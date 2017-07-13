angular.module('karizma.account')
    .controller('LoginController', ['$rootScope', '$scope', '$http', '$location', '$timeout',
        function ($rootScope, $scope, $http, $location, $timeout) {
            $scope.login = function () {
                $scope.ui.block();
                Parse.User.logIn($scope.loginDetails.username, $scope.loginDetails.password).then(function (user) {
                    $scope.ui.unblock();
                    $timeout(function () {
                        $rootScope.isAuthenticated = true;
                        $rootScope.currentUser = user;
                        $location.path('/');
                    });
                }, function (res) {
                    $timeout(function () {
                        $scope.ui.unblock();
                        $scope.error = true;
                    });
                });
            };

            $scope.logout = function () {
                Parse.User.logOut().then(function () {
                    $timeout(function () {
                        $rootScope.currentUser = null;
                        $rootScope.isAuthenticated = false;
                        $location.path('/account/login');
                    });
                });
            };
        }
    ]);