 angular.module('karizma.user')
    .controller('UserController', ['$scope', '$http', 'User',
        function ($scope, $http, User) {
            $scope.filters = {
                page: 1,
                pageSize: 10
            };

            var countQuery = new User.Query();
            countQuery.count().then(function (count) {
                $scope.$broadcast('total-updated', {
                    total: count,
                    pageSize: $scope.filters.pageSize
                });
            });

            var refresh = function () {
                var query = new User.Query();
                $scope.ui && $scope.ui.block();
                if ($scope.filters.search) {
                    var name = new User.Query();
                    name.matches('fullName', '.*' + decodeURIComponent($scope.filters.search) + '.*', 'i');
                    var email = new User.Query();
                    email.matches('email', '.*' + decodeURIComponent($scope.filters.search) + '.*', 'i');
                    query = Parse
                        .Query
                        .or
                        .apply(null, [name, email]);
                }
                query.paged($scope.filters.page, $scope.filters.pageSize)
                    .descending('createdAt')
                    .notEqualTo('type',"admin")
                    .find()
                    .then(function (users) {
                        $scope.users = users;
                        $scope.ui.unblock();
                    });
            };

            $scope.$watch('filters', refresh, true);
        }
    ]);