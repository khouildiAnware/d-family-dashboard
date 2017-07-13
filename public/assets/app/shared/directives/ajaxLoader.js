angular.module('karizma.shared')
    .directive('ajaxLoader', function () {
        return {
            restrict: 'E',
            template: '<center>Loading...</center>'
        };
    });