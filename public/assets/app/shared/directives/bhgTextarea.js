angular.module('karizma.shared')
    .directive('bhgTextarea', function() {
        return {
            restrict: 'E',
            templateUrl: '/template/shared/textarea',
            scope: {
                selectedLanguage: '=',
                model: '='
            }
        };
    });