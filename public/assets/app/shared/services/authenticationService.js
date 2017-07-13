angular.module('karizma.shared')
    .provider('AuthenticationService',
        function () {
            var working = false;
            this.$get = ['$rootScope', 'User', function ($rootScope, User) {
                return {
                    identity: function () {
                        if ($rootScope.currentUser || working) {
                            return;
                        }

                        working = true;

                        return User.identity(function (res) {
                            $rootScope.currentUser = res;
                            $rootScope.currentUser.isWriter = res.profile.type === 'Writer';
                            $rootScope.currentUser.isClient = res.profile.type === 'Client';
                            $rootScope.currentUser.isAdministrator = res.profile.type === 'Administrator';

                            working = false;
                        }, function () {
                            working = false;
                        }).$promise;
                    }
                }
            }];
        });