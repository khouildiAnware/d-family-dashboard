angular.module('karizma.shared')
    .directive('bhgSummernote', function () {
        return {
            restrict: 'E',
            templateUrl: '/template/shared/summernote',
            scope: {
                selectedLanguage: '=',
                model: '='
            }
        };
    });