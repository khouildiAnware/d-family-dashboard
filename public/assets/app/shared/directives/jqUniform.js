angular.module('karizma.shared')
    .directive('input', ['$timeout', function ($timeout) {
        return {
            restrict: 'E',
            link: function (scope, element, attr) {
                if (element.is(':radio') || element.is(':checkbox')) {
                    if ('noUniform' in attr) {
                        return;
                    }

                    $timeout(function() {
                        element.uniform();
                    });

                    element.on('change', function() {
                        element.uniform('refresh');
                    });
                }
            }
        };
    }]);