angular.module('karizma.shared')
    .directive('kzPageSize', ['$parse', function ($parse) {
        return {
            restrict: 'E',
            scope: {
                pageSize: '=',
            },
            template: '<div class="page-size-options">' +
            '<select ng-model="pageSize" ng-options="o as o for o in pageSizeOptions" class="form-control pull-left" style="width:auto;"></select>' +
            '</div>',
            link: function (scope, element, attr) {
                scope.pageSizeOptions = $parse(attr.options)();
            }
        };
    }]);