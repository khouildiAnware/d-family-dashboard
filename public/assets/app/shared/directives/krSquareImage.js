angular.module('karizma.shared')
    .directive('krSquareImage', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                attr.$observe('krSquareImage', function(v){
                    if (v){
                        element.css('background-image', 'url(' + v + ')');
                    }
                    else {
                        element.css('background-image', 'none');
                    }
                });
            }
        };
    });