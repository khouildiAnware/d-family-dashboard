angular.module('karizma.shared')
    .directive('bsCarousel', ['$rootScope', function ($rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var $element = $(element);
                scope[attrs.bsCarousel] = {
                    next: function () {
                        $element.carousel('prev');
                    },
                    prev: function () {
                        $element.carousel('next');
                    },
                    goTo: function (number) {
                        $element.carousel(number);
                    },
                    isFirst: function () {
                        return $element.find('.item.active').index() <= 0;
                    },
                    index: function () {
                        return $element.find('.item.active').index();
                    }
                };

                $element.on('slid.bs.carousel', function () {
                    if (attrs.onSlide) {
                        var onSlideFn = $parse(attrs.onSlide);
                        var slideIndex = $element.find('.item.active').index();
                        onSlideFn(scope, { index: slideIndex });
                        if (!scope.$$phase)
                            scope.$apply();
                    }
                });
            }
        };
    }]);