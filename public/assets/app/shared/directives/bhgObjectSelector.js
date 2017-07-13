angular.module('karizma.shared')
    .directive('bhgObjectSelector', ['$rootScope', '$timeout', 'languageFilter', function ($rootScope, $timeout, languageFilter) {
        return {
            restrict: 'E',
            scope: {
                selectedObject: '=?',
                onObjectSelected: '&?',
                language: '=?',
                query: '=?'
            },
            templateUrl: '/template/shared/object-selector',
            link: function (scope, element, attr) {

                scope.getLabel = function (obj) {
                    if (obj) {
                        return languageFilter(obj[attr.nameKey], scope.language) || 'بدون إسم';
                    }

                    if (scope.selectedObject) {
                        return languageFilter(scope.selectedObject[attr.nameKey], scope.language);
                    }

                    return attr.defaultLabel;
                };

                var objectsLoaded = false;
                var button = element.find('button');
                button.webuiPopover({
                    title: attr.defaultLabel,
                    animation: 'pop',
                    multi: false,
                    closeable: true,
                    width: 240,
                    placement: 'bottom',
                    style: 'dropdown language-' + scope.language,
                    onShow: function ($element) {
                        $element.removeClass('language-ar language-en');
                        $element.addClass('language-' + scope.language);

                        if (objectsLoaded) {
                            return;
                        }
                        objectsLoaded = true;

                        var query = scope.query;
                        query.find().then(function (objects) {
                            $timeout(function () {
                                scope.objects = objects;
                            });
                        });
                    }
                });

                scope.selectObject = function (object) {
                    scope.selectedObject = object;
                    scope.onObjectSelected && scope.onObjectSelected({
                        object: object
                    });
                    button.webuiPopover('hide');
                };
            }
        };
    }]);