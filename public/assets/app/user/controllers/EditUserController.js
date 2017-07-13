angular
    .module('karizma.user')
    .controller('EditUserController', [
        '$scope',
        '$http',
        '$route',
        '$timeout',
        'User',
        function ($scope, $http, $route, $timeout, User) {
            $scope.user = $route.current.locals.user;

            $scope.save = function () {
                $scope.saving = true;
                $scope.error = false;
                $scope
                    .user
                    .save(null, {useMasterKey: true})
                    .then(function () {
                        $timeout(function () {
                            $scope.success = true;
                            $scope.saving = false;
                        });
                        swal({title: "تم الحفظ",timer: 2000,showConfirmButton:false});
                    }, function (error) {
                        $timeout(function () {
                            $scope.error = error.message;
                        });
                    });
            };

            $scope.removeAvatar = function () {
                $timeout(function () {
                    $scope.user.photo = null;
                });
            };

            $scope.$on('$destroy', function iVeBeenDismissed() {
                $scope
                    .user
                    .revert();
            });
        }
    ]);