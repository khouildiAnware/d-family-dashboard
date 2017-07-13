angular.module('karizma.shared')
    .directive('krPager', function () {
        return {
            restrict: 'E',
            scope: { page: '=', pageSize: '=' },
            templateUrl: '/template/shared/pager',
            link: function (scope, element, attr) {
                var name = attr.name;

                var getEventName = function () {
                    return name ? name + '.page-changed' : 'page-changed';
                };

                scope.next = function () {
                    scope.page++;
                    scope.$broadcast(getEventName(), { pageId: scope.page });
                };

                scope.prev = function () {
                    scope.page--;
                    scope.$emit(getEventName(), { pageId: scope.page });
                };

                scope.goTo = function (page) {
                    scope.page = page;
                    scope.$emit(getEventName(), { pageId: scope.page });
                };

                scope.$on('total-updated', function (e, data) {
                    if (name && data.name && data.name !== name) {
                        return;
                    }
                    var totalPages = Math.ceil(data.total / scope.pageSize);
                    scope.pageNumbers = _.range(1, totalPages + 1);
                    scope.totalPages = totalPages;
                });
            }
        };
    });