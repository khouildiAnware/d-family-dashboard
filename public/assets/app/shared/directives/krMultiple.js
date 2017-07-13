angular.module('karizma.shared')
    .directive('krMultiple', function () {
        return  {
            restrict: 'A',
            scope: {
                kzMultiple: '='
            },
            link: function (scope, element) {
                var unwatch = scope.$watch('kzMultiple', function (newValue) {
                    if(newValue) {
                        element.attr('multiple', 'multiple');
                    } else {
                        element.removeAttr('multiple');
                    }
                });
            }
        };
    });