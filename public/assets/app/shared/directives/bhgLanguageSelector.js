angular.module('karizma.shared')
    .directive('bhgLanguageSelector', function() {
        return {
            restrict: 'E',
            templateUrl: '/template/shared/language-selector',
            link: function(scope, element, attr) {
                scope.selectedLanguage = 'ar';
                scope.switchLanguage = function(){
                    if (scope.selectedLanguage === 'en'){
                        scope.selectedLanguage = 'ar';
                    }
                    else {
                        scope.selectedLanguage = 'en';                        
                    }
                };
            }
        };
    });