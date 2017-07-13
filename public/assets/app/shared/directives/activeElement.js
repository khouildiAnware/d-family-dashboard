angular.module('karizma.shared')
    .directive('activeElement', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var href = element.attr('href');
                if (href.lastIndexOf('/') !== href.indexOf('/')) {
                    href = '/' + href.substring(1, href.indexOf('/', 1));
                }

                var className = 'active open';

                scope.$on('$routeChangeSuccess',
                    function() {
                        if (href === '/') {
                            if (document.location.pathname === '/') {
                                element.parent().addClass(className);
                            } else {
                                element.parent().removeClass(className);
                            }
                        } else {
                            if (document.location.pathname.indexOf(href) >= 0) {
                                element.parent().addClass(className);
                            } else {
                                element.parent().removeClass(className);
                            }
                        }
                    });
            }
        };
    });