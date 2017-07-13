angular.module('karizma.shared')
    .directive('tagsInput', ['$parse', function ($parse) {
        return {
            require: '?ngModel',
            restrict: 'A',
            link: function (scope, element, attr, ngModel) {
                element.tagsinput({
                    trimValue: true
                });
            }
        };
    }]);