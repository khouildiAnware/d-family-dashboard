angular.module('karizma.shared')
    .directive('bhgInput', function() {
        return {
            restrict: 'E',
            templateUrl: '/template/shared/input',
            scope: {
                selectedLanguage: '=',
                model: '='
            }
        };
    });