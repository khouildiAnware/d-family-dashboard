angular.module('karizma.shared')
    .directive('translateable', function () {
        return {
            restrict: 'C',
            link: function (scope, element, attr) {
                element.tooltip({
                    title: 'هذا الحقل قابل للترجمة',
                    container: 'body'
                });
            }
        };
    });