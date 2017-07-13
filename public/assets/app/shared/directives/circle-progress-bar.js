angular.module('karizma.shared')
    .directive('circleProgressBar', ['$timeout', 'Category', function ($timeout, Category) {
        return {
            restrict: 'C',
            scope: {
               progress:'='
            },
            templateUrl: '/template/shared/circle-progress-bar',
            link: function (scope, element, attr) {
                scope.$watch('progress', function(p){
                    element.attr('data-progress', p);
                });
            }
        };
    }]);