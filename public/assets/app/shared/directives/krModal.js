angular.module('karizma.shared')
    .directive('krModal', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                scope[attr.krModal] = {
                    show: function() {
                        $(element).modal('show');
                        },
                    
                    hide: function(){
                        $(element).modal('hide');
                    }
                };
            }
        };
    });