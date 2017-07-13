angular.module('karizma.shared')
    .directive('bhgCategorySelector', ['$rootScope', '$timeout', 'Category', 'EventCategory', function ($rootScope, $timeout, Category, EventCategory) {
        return {
            restrict: 'E',
            scope: {
                selectedCategory: '=?',
                onCategorySelected: '&?',
                language: '=?'
            },
            templateUrl: '/template/shared/category-selector',
            link: function (scope, element, attr) {
                var categoryType = attr.categoryType || 'place';

                var buildQuery = function () {
                    var query;

                    if (categoryType === 'place') {
                        query = new Category.Query();
                    } else {
                        query = new EventCategory.Query();
                    }

                    return query;
                };

                var categoriesLoaded = false;
                var button = element.find('button');
                button.webuiPopover({
                    title: 'اختر تصنيفا',
                    animation: 'pop',
                    multi: false,
                    closeable: true,
                    width: 240,
                    placement: 'bottom',
                    style: 'dropdown language-' + scope.language,
                    onShow: function ($element) {
                        $element.removeClass('language-ar language-en');
                        $element.addClass('language-' + scope.language);

                        if (categoriesLoaded) {
                            return;
                        }
                        categoriesLoaded = true;

                        var query = buildQuery();
                        query.include('name');
                        query.find().then(function (categories) {
                            $timeout(function () {
                                scope.categories = categories;
                            });
                        });
                    }
                });

                scope.selectCategory = function (category) {
                    scope.selectedCategory = category;
                    button.webuiPopover('hide');
                };
            }
        };
    }]);