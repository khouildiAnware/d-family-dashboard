angular.module('karizma.shared')
    .directive('formatName', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope.$on('$routeChangeSuccess',
                    function () {
                        if (document.location.pathname === element[0].pathname) {
                            element.parent().addClass('active');
                        } else {
                            element.parent().removeClass('active');
                        }
                    });
            }
        };
    });