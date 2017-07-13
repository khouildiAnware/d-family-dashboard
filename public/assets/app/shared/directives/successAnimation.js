angular.module('karizma.shared')
    .directive('successAnimation', function () {
        return {
            restrict: 'E',
            template: '<div class="sweet-alert inline-success">' +
                        '<div class="sa-icon sa-success animate">' +
                            '<span class="sa-line sa-tip animateSuccessTip"></span>' +
                            '<span class="sa-line sa-long animateSuccessLong"></span>' +
                            '<div class="sa-placeholder"></div>' +
                            '<div class="sa-fix"></div>' +
                        '</div>' +
                      '</div>'
        };
    });