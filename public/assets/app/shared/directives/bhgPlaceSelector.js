angular.module('karizma.shared')
    .directive('bhgPlaceSelector', ['$timeout', 'Place', function ($timeout, Place) {
        return {
            restrict: 'E',
            scope: {
                selectedPlace: '=?',
                onPlaceSelected: '&?',
                language: '=?'
            },
            templateUrl: '/template/shared/place-selector',
            link: function (scope, element, attr) {
                scope.placesLoading = false, initialized = false;
                scope.allowRemove = 'allowRemove' in attr ? attr.allowRemove === 'true' : true;
                var refreshPlaces = function (keywords) {
                    scope.placesLoading = true;
                    return Parse.Cloud.run('Search', {
                        q: keywords,
                        include: ['name', 'images'],
                        limit: 5,
                        skip: 0
                    }).then(function (places) {
                        scope.placesLoading = false;
                        return places;
                    });
                };

                var button = element.find('button');
                button.webuiPopover({
                    title: 'اختر مكانا',
                    animation: 'pop',
                    multi: false,
                    closeable: true,
                    width: 240,
                    placement: 'bottom',
                    style: 'dropdown language-' + scope.language,
                    onShow: function ($element) {
                        $element.removeClass('language-ar language-en');
                        $element.addClass('language-' + scope.language);
                        $element.find('input').focus();
                        if (scope.placesLoading) {
                            return;
                        }
                        initialized = true;
                    },
                    onHide: function () {
                        scope.keywords = null;
                    }
                });

                scope.selectPlace = function (place) {
                    scope.selectedPlace = place;
                    scope.onPlaceSelected && scope.onPlaceSelected({
                        place: place
                    });
                    button.webuiPopover('hide');
                };

                scope.$watch('keywords', function (k) {
                    if (!initialized || !scope.keywords) {
                        return;
                    }

                    refreshPlaces(scope.keywords).then(function (places) {
                        $timeout(function () {
                            scope.places = places;
                        });
                    });
                });
            }
        };
    }]);