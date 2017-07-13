angular.module('karizma.shared')
    .directive('imgLoader', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.hide();

                element.after('<div class="img-placeholder"></div>');
                element.one('load', function() {
                    element.show();
                    element.next('.img-placeholder').remove();
                });

                element.one('error', function() {
                    element.next('.img-placeholder').addClass('loading-error');

                    });
            }
        };
    });